import React from 'react'
import { DARK_THEME, LIGHT_THEME } from 'constants/theme'
import styled from '@emotion/styled'
import DarkIcon from '/static/dark.svg'
import LightIcon from '/static/light.svg'
import useTheme from 'hooks/useTheme'

const Light = styled(LightIcon)`
  cursor: pointer;

  @media (max-width: 48rem) {
    width: 2.5rem;
    height: 2.5rem;
  }
`

const Dark = styled(DarkIcon)`
  cursor: pointer;

  @media (max-width: 48rem) {
    width: 3.5rem;
    height: 3.5rem;
  }
`

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme()

  if (!theme) return null

  return (
    <>
      {theme === DARK_THEME ? (
        <Light onClick={() => toggleTheme(LIGHT_THEME)}>To Light</Light>
      ) : (
        <Dark onClick={() => toggleTheme(DARK_THEME)}>To Dark</Dark>
      )}
    </>
  )
}

export default ThemeSwitch
