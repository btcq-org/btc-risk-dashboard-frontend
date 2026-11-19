# Deploying the QBTC Risk Dashboard (frontend)

The explorer is a static single-page app. Vite builds it into `dist/`, the build is copied
to `/var/www/qbtc-dashboard`, and the `dev-nginx-1` container serves that folder directly.

```
browser ──► Cloudflare ──► dev-nginx-1 (:80) ──► /var/www/qbtc-dashboard   (static files)
                                         └─────► uvicorn API (172.17.0.1:5000)
```

- nginx config: `/root/dev/nginx/nginx.conf`, mounted through `/root/dev/docker-compose.yaml`
  (both in the `btc-risk-dashboard` repo). `/var/www/qbtc-dashboard` is mounted read-only
  into the container at `/usr/share/nginx/qbtc-dashboard`.
- nginx answers `dashboard.thegreatlich.xyz` and `indexer.qbtc.net`. Any unknown host gets 444.
- The container has `restart: unless-stopped`, so the site comes back after a reboot.
- The data comes from the Python API (`/root/dev/indexer/api.py`).

## Prerequisites

| Tool | Version on the server | Notes |
|---|---|---|
| Node | 24.11.1 | installed with nvm (`/root/.nvm`) |
| pnpm | 10.22.0 | use pnpm. `pnpm-lock.yaml` is the lockfile |

`.npmrc` hoists `@heroui/*`, which HeroUI's Tailwind plugin needs. Don't delete it.

## Configuration (build time)

Vite bakes `VITE_*` variables into the bundle **when you build**. Changing `.env` has no
effect until you rebuild.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.thegreatlich.xyz/` | Python API. **The trailing slash is required.** |
| `VITE_APP_ENVIRONMENT` | unset | Optional environment label |
| `VITE_SITE_URL` | `https://dashboard.thegreatlich.xyz` | Public URL of the site. Used for link-preview tags, canonical URLs, `robots.txt` and `sitemap.xml`. |

Copy `.env.example` to `.env` and edit it. `.env` is gitignored.

Users can also override the API URL in the browser on the `/settings` page. The override is
stored in localStorage under `settings-storage` and takes precedence over the built-in
defaults. If one browser shows different data from another, check this first.

## Deploying on the production server

1. Get the code:

   ```bash
   cd /root/explorer/btcq-explorer
   git status          # make sure there's no uncommitted work you'd lose
   git pull
   ```

2. Install dependencies and build:

   ```bash
   pnpm install --frozen-lockfile
   pnpm run build      # tsc -b && vite build, then copies .htaccess into dist/
   ```

   This only writes to `dist/`. The live site isn't affected until step 3, so a failed
   build never takes the site down.

3. Publish the build. Keep a copy of the current one first so you can roll back:

   ```bash
   rsync -a --delete /var/www/qbtc-dashboard/ /var/www/qbtc-dashboard.prev/
   rsync -a --delete dist/ /var/www/qbtc-dashboard/
   ```

   That's it. nginx serves the new files right away, with no restart needed.

4. Check that it works:

   ```bash
   curl -sI -H 'Host: dashboard.thegreatlich.xyz' http://127.0.0.1/ | head -1
   curl -sI -H 'Host: dashboard.thegreatlich.xyz' http://127.0.0.1/blocks | head -1   # SPA fallback
   ```

   Both should return `200`. Then open https://dashboard.thegreatlich.xyz and make sure
   the metric cards show real numbers. If the API is unreachable, the app falls back to
   mock metrics.

### Caching

`index.html` is sent with `Cache-Control: no-cache`, so browsers pick up a new deploy on
the next load. Files under `/assets/` have content hashes in their names and are cached for
a year. If you put Cloudflare caching rules in front, keep `index.html` uncached.

### Rollback

```bash
rsync -a --delete /var/www/qbtc-dashboard.prev/ /var/www/qbtc-dashboard/
```

To go back to an older commit instead, check it out, rebuild, and publish again (step 3).

**Don't** delete or move the `/var/www/qbtc-dashboard` folder itself. The container's bind
mount points at that folder, and replacing it breaks the mount until nginx is recreated.
Always change its *contents* with `rsync`.

## Changing the nginx setup

After editing `/root/dev/nginx/nginx.conf`:

```bash
docker exec dev-nginx-1 nginx -t && docker exec dev-nginx-1 nginx -s reload
```

If an editor replaces the file instead of writing it in place, the container keeps seeing
the old version. In that case, or after changing the nginx service in `docker-compose.yaml`,
recreate just the nginx container. The dashboard and API drop for a second or two:

```bash
cd /root/dev && docker compose up -d --no-deps nginx
```

## Adding a domain

1. **Cloudflare DNS**: point it at the server, proxied.
2. **nginx**: add it to the frontend `server_name` in `/root/dev/nginx/nginx.conf`, then reload
   as above.

## Local development

```bash
pnpm install
pnpm run dev        # Vite dev server with hot reload
```

`pnpm run preview` serves `dist/` locally to test a production build. It isn't used in
production any more, and `vite.config.ts` `preview.allowedHosts` only matters for it.

## Hosting elsewhere

`dist/` is plain static files, so any static host works as long as every route falls
back to `index.html` (the router uses browser history). Config files for this are already
in the repo:

- Vercel: `vercel.json`
- Netlify / Cloudflare Pages: `public/_redirects`
- Apache: `.htaccess` (copied into `dist/` by the build)

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Old version still showing after a deploy | The rsync went to the wrong folder, or Cloudflare cached `index.html`. Check `ls -l /var/www/qbtc-dashboard/assets` and purge the Cloudflare cache. |
| Every page is a 404 | The folder was replaced instead of synced, so the bind mount broke. Run `docker compose up -d --no-deps nginx` from `/root/dev`. |
| Dashboard shows round or fake-looking numbers | API unreachable, so the mock fallback is showing. Check `curl https://api.thegreatlich.xyz/stats/overview`, the trailing slash in `VITE_API_BASE_URL`, and the browser's `/settings` override. |
| 444 or empty response through the domain | nginx doesn't know the hostname (see *Adding a domain*). |
| Site down after a reboot | Check `docker ps`. `dev-nginx-1` should restart by itself. If it didn't, run `docker compose up -d --no-deps nginx` from `/root/dev`. |
