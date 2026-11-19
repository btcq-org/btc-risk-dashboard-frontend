import React, { useState, useEffect } from 'react'
import qbctLogoLight from '../../assets/QBTC Logo Light.svg'
import qbctLogoDark from '../../assets/QBTC Logo Dark.svg'

const Footer: React.FC = () => {
  const [rpcHealth, setRpcHealth] = useState<'checking' | 'healthy' | 'unhealthy'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkRpcHealth = async () => {
    try {
      setRpcHealth('checking')
      // Simulate API call to health endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate random health status (90% healthy)
      const isHealthy = Math.random() > 0.1
      setRpcHealth(isHealthy ? 'healthy' : 'unhealthy')
      setLastChecked(new Date())
    } catch {
      setRpcHealth('unhealthy')
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkRpcHealth()
    // Check health every 30 seconds
    const interval = setInterval(checkRpcHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getHealthStatus = () => {
    switch (rpcHealth) {
      case 'checking':
        return {
          text: 'Checking...',
          color: 'text-yellow-500 dark:text-yellow-400',
          dotColor: 'bg-yellow-500 dark:bg-yellow-400'
        }
      case 'healthy':
        return {
          text: 'RPC Healthy',
          color: 'text-green-500 dark:text-green-400',
          dotColor: 'bg-green-500 dark:bg-green-400'
        }
      case 'unhealthy':
        return {
          text: 'RPC Unhealthy',
          color: 'text-red-500 dark:text-red-400',
          dotColor: 'bg-red-500 dark:bg-red-400'
        }
    }
  }

  const healthStatus = getHealthStatus()

  return (
    <footer className="bg-[#E5E8EC] dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center">
                {/* Light theme: dark logo */}
                <img
                  src={qbctLogoDark}
                  alt="QBTC"
                  className="h-7 w-auto block dark:hidden"
                />
                {/* Dark theme: light logo */}
                <img
                  src={qbctLogoLight}
                  alt="QBTC"
                  className="h-7 w-auto hidden dark:block"
                />
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Explorer
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Advanced Bitcoin blockchain analysis and risk assessment platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Status Page</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* RPC Health Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-white uppercase tracking-wider">System Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${healthStatus.dotColor} ${rpcHealth === 'checking' ? 'animate-pulse' : ''}`}></div>
                <span className={`text-sm font-medium ${healthStatus.color}`}>
                  {healthStatus.text}
                </span>
              </div>
              {lastChecked && (
                <p className="text-xs text-gray-400 dark:text-gray-400">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={checkRpcHealth}
                disabled={rpcHealth === 'checking'}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {rpcHealth === 'checking' ? 'Checking...' : 'Refresh Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400 dark:text-gray-400">
                © 2026 QBTC Explorer. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 dark:text-gray-400">Version 0.0.1</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 dark:text-gray-400">Powered by</span>
                <span className="text-sm font-medium text-[#F7931A] dark:text-[#F7931A]">Bitcoin</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">QBTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
