import React, { MutableRefObject, useEffect, useRef } from 'react'

const src = 'https://utteranc.es/client.js'
const repo = 'dkmqflx/gatsby-blog'

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

  useEffect(() => {
    if (element.current === null) return

    const utterances: HTMLScriptElement = document.createElement('script')

    const attributes: UtterancesAttributesType = {
      src,
      repo,
      'issue-term': 'title',
      label: 'Comment',
      theme: `github-light`,
      crossorigin: 'anonymous',
      async: 'true',
    }

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value)
    })

    element.current.appendChild(utterances)
  }, [])

  return <div ref={element}></div>
}

export default PostUtterance
