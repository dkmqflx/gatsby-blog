import { initialTheme } from 'hooks/useTheme'
import React, { MutableRefObject, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { DARK_THEME } from 'constants/theme'

const src = 'https://utteranc.es/client.js'
const repo = 'dkmqflx/gatsby-blog'
const UTTERANCE_CLASS = '.utterances-frame'

type UtterancesAttributesType = {
  src: string
  repo: string
  'issue-term': string
  label: string
  theme: string
  crossorigin: string
  async: string
}

const PostUtterance = () => {
  const element: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null)

  const theme = useRecoilValue(initialTheme)

  const createUtterance = () => {
    const utterances: HTMLScriptElement = document.createElement('script')
    const attributes: UtterancesAttributesType = {
      src,
      repo,
      'issue-term': 'title',
      label: 'Comment',
      theme: `${theme === DARK_THEME ? 'github-dark' : 'github-light'}`,
      crossorigin: 'anonymous',
      async: 'true',
    }

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })

    element?.current?.appendChild(utterances)
  }

  const changeUtterance = () => {
    const message = {
      type: 'set-theme',
      theme: theme === DARK_THEME ? 'github-dark' : 'github-light',
    }
    const iframe = document.querySelector<HTMLIFrameElement>(UTTERANCE_CLASS)

    iframe?.contentWindow?.postMessage(message, src)
  }

  useEffect(() => {
    if (theme === '') return

    element.current?.querySelector(UTTERANCE_CLASS)
      ? changeUtterance()
      : createUtterance()
  }, [theme])

  return <div ref={element}></div>
}

export default PostUtterance
