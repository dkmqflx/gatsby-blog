import { useEffect, useState } from 'react'
import { DARK_THEME, LIGHT_THEME, BLOG_THEME } from 'constants/theme'

type ThemeType = 'dark' | 'light'

const useTheme = () => {
  const [theme, setTheme] = useState<string | null>(null)

  const toggleTheme = (theme: ThemeType) => {
    switch (theme) {
      case DARK_THEME:
        localStorage.setItem(BLOG_THEME, DARK_THEME)
        setTheme(DARK_THEME)
        document.body.classList.add(DARK_THEME)
        document.body.classList.remove(LIGHT_THEME)
        break
      case LIGHT_THEME:
        localStorage.setItem(BLOG_THEME, LIGHT_THEME)
        setTheme(LIGHT_THEME)
        document.body.classList.add(LIGHT_THEME)
        document.body.classList.remove(DARK_THEME)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(document.body.classList.value)
    }
  }, [])

  return { theme, toggleTheme }
}

export default useTheme
