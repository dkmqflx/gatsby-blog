import { useEffect, useState, createContext } from 'react'
import { DARK_THEME, LIGHT_THEME, BLOG_THEME } from 'constants/theme'
import { useCallback } from 'react'

export type ThemeType = 'dark' | 'light'
export type ThemeActionType = (theme: ThemeType) => void

export const ThemeValueContext = createContext<ThemeType | null>(null)
export const ThemeToggleContext = createContext<ThemeActionType | null>(null)

const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType | null>(null)

  const toggleTheme = useCallback((theme: ThemeType) => {
    switch (theme) {
      case DARK_THEME:
        localStorage.setItem(BLOG_THEME, DARK_THEME)
        document.body.classList.add(DARK_THEME)
        document.body.classList.remove(LIGHT_THEME)

        setTheme(DARK_THEME)
        break
      case LIGHT_THEME:
        localStorage.setItem(BLOG_THEME, LIGHT_THEME)
        document.body.classList.add(LIGHT_THEME)
        document.body.classList.remove(DARK_THEME)

        setTheme(LIGHT_THEME)

        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(document.body.classList.value as ThemeType)
    }
  }, [])

  return { ThemeValueContext, ThemeToggleContext, theme, toggleTheme }
}

export default useTheme
