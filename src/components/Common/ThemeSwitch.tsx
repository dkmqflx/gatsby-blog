import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import DarkIcon from '/static/dark.svg'
import LightIcon from '/static/light.svg'

const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'
const BLOG_THEME = 'blog_theme'

type ThemeType = 'dark' | 'light'

const Light = styled(LightIcon)`
  cursor: pointer;
`

const Dark = styled(DarkIcon)`
  cursor: pointer;
`

const Toggle = () => {
  const [theme, setTheme] = useState<string | null>(null)

  const toggleTheme = (theme: ThemeType) => {
    switch (theme) {
      case DARK_THEME:
        localStorage.setItem(BLOG_THEME, DARK_THEME)
        setTheme(DARK_THEME)
        document.body.classList.add('dark')
        document.body.classList.remove('light')
        break
      case LIGHT_THEME:
        localStorage.setItem(BLOG_THEME, LIGHT_THEME)
        setTheme(LIGHT_THEME)
        document.body.classList.add('light')
        document.body.classList.remove('dark')
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

  if (!theme) return null

  return (
    <>
      {theme === DARK_THEME ? (
        <Light onClick={() => toggleTheme('light')}>To Light</Light>
      ) : (
        <Dark onClick={() => toggleTheme('dark')}>To Dark</Dark>
      )}
    </>
  )
}

export default Toggle
