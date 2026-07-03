import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useStoreSettings } from '../api/hooks'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  settings: {
    primary_color: string
    secondary_color: string
    font_family: string
    theme: Theme
  }
}

const defaults = {
  primary_color: '#3B82F6',
  secondary_color: '#1E40AF',
  font_family: 'Inter',
  theme: 'light' as Theme,
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  settings: defaults,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: storeSettings } = useStoreSettings()
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light'
  })

  const primary = storeSettings?.primary_color || defaults.primary_color
  const secondary = storeSettings?.secondary_color || defaults.secondary_color

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', primary)
    root.style.setProperty('--color-secondary', secondary)

    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    const bg = theme === 'dark' ? '#0f172a' : '#ffffff'
    const bgCard = theme === 'dark' ? '#1e293b' : '#ffffff'
    const bgSurface = theme === 'dark' ? '#1e293b' : '#f9fafb'
    const text = theme === 'dark' ? '#e2e8f0' : '#111827'
    const textMuted = theme === 'dark' ? '#94a3b8' : '#6b7280'
    const border = theme === 'dark' ? '#334155' : '#e5e7eb'

    root.style.setProperty('--color-bg', bg)
    root.style.setProperty('--color-bg-card', bgCard)
    root.style.setProperty('--color-bg-surface', bgSurface)
    root.style.setProperty('--color-text', text)
    root.style.setProperty('--color-text-muted', textMuted)
    root.style.setProperty('--color-border', border)

    document.body.style.backgroundColor = bg
    document.body.style.color = text
  }, [theme, primary, secondary])

  useEffect(() => {
    if (storeSettings?.theme && !localStorage.getItem('theme')) {
      setTheme(storeSettings.theme)
    }
  }, [storeSettings])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, settings: { primary_color: primary, secondary_color: secondary, font_family: storeSettings?.font_family || defaults.font_family, theme } }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
