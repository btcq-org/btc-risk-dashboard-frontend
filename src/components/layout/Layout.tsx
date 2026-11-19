import { useEffect } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { RouteHandle } from '../../router'
import { useDashboardStore } from '../../stores/dashboardStore'
import { Header } from './Header'
import Footer from './Footer'

const SITE_NAME = 'QBTC Risk Dashboard'

export const Layout = () => {
  const fetchBitcoinPrice = useDashboardStore((s) => s.fetchBitcoinPrice)
  const { pathname } = useLocation()
  const matches = useMatches()
  const { t, i18n } = useTranslation()
  const titleKey = matches
    .map((m) => (m.handle as RouteHandle | undefined)?.titleKey)
    .filter(Boolean)
    .pop()

  // Load BTC price on first load so Header and Metrics show it regardless of initial route
  useEffect(() => {
    fetchBitcoinPrice()
  }, [fetchBitcoinPrice])

  // index.html ships a canonical for the home page (for crawlers that don't run JS).
  // Point it at the current route, always on the main domain, so pages served from
  // other hostnames, or from /dashboard (an alias of /), don't count as duplicates.
  useEffect(() => {
    const path = pathname === '/dashboard' ? '/' : pathname.replace(/\/+$/, '') || '/'
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', import.meta.env.VITE_SITE_URL + path)
  }, [pathname])

  // Per-route tab title, e.g. "Latest Blocks · QBTC Risk Dashboard". Follows the UI language.
  useEffect(() => {
    document.title = titleKey ? `${t(titleKey)} · ${SITE_NAME}` : SITE_NAME
  }, [titleKey, t, i18n.language])

  return (
    <div className="min-h-screen">
      <div className="bg-[#F4F6F9] dark:bg-zinc-950 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
