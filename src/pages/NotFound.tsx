import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// The SPA fallback answers unknown URLs with HTTP 200, so tell crawlers not to
// index this page (otherwise it's a "soft 404").
const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

export const NotFound = () => {
  const { t } = useTranslation()
  useNoIndex()

  return (
    <main className="max-w-7xl mx-auto px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-[#F7931A]">404</p>
      <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{t('notFound.title')}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{t('notFound.description')}</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-[#F7931A] px-5 py-2.5 font-medium text-white hover:opacity-90"
      >
        {t('notFound.backHome')}
      </Link>
    </main>
  )
}
