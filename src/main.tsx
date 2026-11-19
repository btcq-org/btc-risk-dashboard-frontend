import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import './index.css'
import './i18n/config'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  </StrictMode>,
)
