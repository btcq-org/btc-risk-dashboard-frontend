import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Dashboard } from '../pages/Dashboard'
import { About } from '../pages/About'
import { Settings } from '../pages/Settings'
import { LatestAddressesPage } from '../pages/LatestAddressesPage'
import { LatestUTXOsPage } from '../pages/LatestUTXOsPage'
import { LatestBlocksPage } from '../pages/LatestBlocksPage'
import { NotFound } from '../pages/NotFound'

// Routes can set handle.titleKey (an i18n key); Layout turns it into document.title.
export type RouteHandle = { titleKey?: string }

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'about',
        handle: { titleKey: 'navigation.about' },
        element: <About />
      },
      {
        path: 'settings',
        handle: { titleKey: 'navigation.settings' },
        element: <Settings />
      },
      {
        path: 'addresses',
        handle: { titleKey: 'latest.latestAddresses' },
        element: <LatestAddressesPage />
      },
      {
        path: 'utxos',
        handle: { titleKey: 'latest.latestUtxos' },
        element: <LatestUTXOsPage />
      },
      {
        path: 'blocks',
        handle: { titleKey: 'latest.latestBlocks' },
        element: <LatestBlocksPage />
      },
      {
        path: '*',
        handle: { titleKey: 'notFound.title' },
        element: <NotFound />
      }
    ]
  }
])
