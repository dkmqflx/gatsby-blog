import { useEffect } from 'react'
import { DARK_THEME, LIGHT_THEME, BLOG_THEME } from 'constants/theme'
import { atom, useRecoilState } from 'recoil'

type ThemeType = 'dark' | 'light'

export const initialRecoilTheme = atom({
  key: 'theme',
  default: '',
})

const useTheme = () => {
  const [recoilTheme, setRecoilTheme] = useRecoilState(initialRecoilTheme)

  const toggleTheme = (theme: ThemeType) => {
    switch (theme) {
      case DARK_THEME:
        localStorage.setItem(BLOG_THEME, DARK_THEME)
        document.body.classList.add(DARK_THEME)
        document.body.classList.remove(LIGHT_THEME)

        setRecoilTheme(DARK_THEME)
        break
      case LIGHT_THEME:
        localStorage.setItem(BLOG_THEME, LIGHT_THEME)
        document.body.classList.add(LIGHT_THEME)
        document.body.classList.remove(DARK_THEME)

        setRecoilTheme(LIGHT_THEME)

        break
      default:
        break
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRecoilTheme(document.body.classList.value)
    }
  }, [])

  return { theme: recoilTheme, toggleTheme }
}

export default useTheme
