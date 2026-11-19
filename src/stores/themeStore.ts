import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  getEffectiveTheme: () => 'light' | 'dark'
  toggleTheme: () => void
}

// Helper function to get system default theme
const getSystemDefaultTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// Keep in sync with the header's top strip (bg-gray-50 / dark:bg-zinc-900) and index.html.
const THEME_COLORS = { light: '#F9FAFB', dark: '#18181B' } as const

// Sets data-theme and points the browser bar colour at the chosen theme.
// For 'system', each media-scoped theme-color tag goes back to its own colour.
const applyTheme = (theme: Theme) => {
  const html = document.documentElement
  if (theme === 'system') {
    html.removeAttribute('data-theme')
  } else {
    html.setAttribute('data-theme', theme)
  }
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const scheme = meta.media.includes('dark') ? 'dark' : 'light'
    meta.content = THEME_COLORS[theme === 'system' ? scheme : theme]
  })
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemDefaultTheme(),
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      getEffectiveTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          return getSystemDefaultTheme()
        }
        return theme
      },
      toggleTheme: () => {
        const { getEffectiveTheme } = get()
        const currentEffectiveTheme = getEffectiveTheme()
        const newTheme = currentEffectiveTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        applyTheme(state ? state.theme : getSystemDefaultTheme())
      }
    }
  )
)
