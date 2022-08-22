import React from 'react'
import { Global, css } from '@emotion/react'

const defaultStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
  }

  html,
  body,
  #___gatsby {
    height: 100%;
  }

  a,
  a:hover {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  body {
    &.light {
      background-color: #f5f5f5;
      color: #161616;
      --secondary-color: #6c6c6c;
      --button-color: #ececec;
      --border-color: #e5e5e5;
    }

    &.dark {
      background-color: #202122;
      color: #fff;
      --secondary-color: #bec1c5;
      --button-color: #303134;
      --border-color: #3d4043;
    }
    transition: background-color 0.3s linear;
  }
`

const GlobalStyle = () => {
  return <Global styles={defaultStyle} />
}

export default GlobalStyle
