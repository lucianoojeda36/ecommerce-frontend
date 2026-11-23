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
  primary_color: '#4F46E5',
  secondary_color: '#4338CA',
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

  const primary = storeSettings?.primary_color || (theme === 'dark' ? '#7C7BFF' : defaults.primary_color)
  const secondary = storeSettings?.secondary_color || (theme === 'dark' ? '#7C7BFF' : defaults.secondary_color)
  const fontFamily = storeSettings?.font_family || defaults.font_family

  useEffect(() => {
    const root = document.documentElement
    const dark = theme === 'dark'

    root.style.setProperty('--color-primary', primary)
    root.style.setProperty('--color-primary-hover', dark ? '#8B8AFF' : '#4338CA')
    root.style.setProperty('--color-secondary', secondary)
    root.style.setProperty('--color-accent', primary)

    const tokens: Record<string, string> = dark
      ? {
          '--color-bg': '#0B0C0E',
          '--color-bg-card': '#111317',
          '--color-bg-surface': '#17191E',
          '--color-bg-input': '#111317',
          '--color-text': '#F2F3F5',
          '--color-text-secondary': '#A1A6B0',
          '--color-text-muted': '#6E747F',
          '--color-border': '#24272E',
          '--color-border-hover': '#343841',
          '--color-success': '#34D399',
          '--color-danger': '#F87171',
          '--color-warning': '#FBBF24',
          '--color-info': '#818CF8',
        }
      : {
          '--color-bg': '#F7F8FA',
          '--color-bg-card': '#FFFFFF',
          '--color-bg-surface': '#F4F5F7',
          '--color-bg-input': '#FFFFFF',
          '--color-text': '#16181D',
          '--color-text-secondary': '#5B606B',
          '--color-text-muted': '#8B909A',
          '--color-border': '#E6E8EB',
          '--color-border-hover': '#D5D8DD',
          '--color-success': '#0F9D6E',
          '--color-danger': '#DC2626',
          '--color-warning': '#D97706',
          '--color-info': '#4F46E5',
        }

    Object.entries(tokens).forEach(([key, value]) => root.style.setProperty(key, value))
    root.style.setProperty('--font-store', `'${fontFamily}', Inter, system-ui, sans-serif`)

    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    document.body.style.backgroundColor = tokens['--color-bg']
    document.body.style.color = tokens['--color-text']
  }, [theme, primary, secondary, fontFamily])

  useEffect(() => {
    if (storeSettings?.theme && !localStorage.getItem('theme')) {
      setTheme(storeSettings.theme)
    }
  }, [storeSettings])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, settings: { primary_color: primary, secondary_color: secondary, font_family: fontFamily, theme } }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
