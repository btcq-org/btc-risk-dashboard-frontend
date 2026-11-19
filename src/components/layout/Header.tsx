import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { ThemeToggle } from '../common/ThemeToggle'
import { LanguageSwitcher } from '../common/LanguageSwitcher'
import { AnimatedNumber } from '../common/AnimatedNumber'
import qbctLogoLight from '../../assets/QBTC Logo Light.svg'
import qbctLogoDark from '../../assets/QBTC Logo Dark.svg'

export const Header = () => {
  const { metrics, bitcoinPrice } = useDashboardStore()
  const { t } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
      {/* Top row: Bitcoin Height and Theme Toggle */}
      <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden sm:flex items-center space-x-3 sm:space-x-6 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-500 font-medium">{t('header.btcHeight')}</span>{' '}
                {metrics.currentBitcoinHeight ? (
                  <AnimatedNumber value={metrics.currentBitcoinHeight} />
                ) : (
                  t('common.loading')
                )}
              </span>
            </div>
            {bitcoinPrice > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-500 font-medium">{t('header.btcPrice')}</span>{' '}
                  <span className="font-semibold">${bitcoinPrice.toLocaleString()}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Bottom row: Logo and Navigation Menu */}
      <div className="bg-gray-50 dark:bg-zinc-900 px-4 sm:px-6 py-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-2px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className="inline-flex items-center">
              {/* Light theme: use dark logo */}
              <img
                src={qbctLogoDark}
                alt="QBTC"
                className="h-7 sm:h-8 w-auto block dark:hidden"
              />
              {/* Dark theme: use light logo */}
              <img
                src={qbctLogoLight}
                alt="QBTC"
                className="h-7 sm:h-8 w-auto hidden dark:block"
              />
            </span>
            <span className="hidden sm:inline">{t('navigation.qbtcExplorer')}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') || isActive('/dashboard') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('navigation.dashboardRisk')}
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('navigation.about')}
            </Link>
            <Link 
              to="/settings" 
              className={`text-sm font-medium transition-colors ${
                isActive('/settings') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('navigation.settings')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            isIconOnly
            variant="light"
            className="md:hidden"
            onPress={toggleMobileMenu}
            aria-label={t('navigation.toggleMenu')}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-zinc-800 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  isActive('/') || isActive('/dashboard') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('navigation.dashboardRisk')}
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  isActive('/about') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('navigation.about')}
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors py-2 ${
                  isActive('/settings') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('navigation.settings')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
