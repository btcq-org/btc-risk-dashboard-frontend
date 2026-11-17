import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDashboardStore } from '../../stores/dashboardStore'
import { Header } from './Header'
import Footer from './Footer'

export const Layout = () => {
  const fetchBitcoinPrice = useDashboardStore((s) => s.fetchBitcoinPrice)
  const { pathname } = useLocation()

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
