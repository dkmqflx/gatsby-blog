import React from 'react'
import styled from '@emotion/styled'

const MarkdownRenderer = styled.div`
  // Renderer Style
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 3.75em 0;
  word-break: break-word;

  // Markdown Style
  line-height: 1.8;

  // Apply Padding Attribute to All Elements
  p {
    padding: 0.5em 0;
  }

  // Adjust Heading Element Style
  h1,
  h2,
  h3 {
    font-weight: 700;
  }

  * + h1,
  * + h2,
  * + h3 {
    margin-top: 1.25em;
  }

  hr + h1,
  hr + h2,
  hr + h3 {
    margin-top: 0;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  // Adjust Quotation Element Style
  blockquote {
    margin: 1.25em 0;
    padding: 0.25em 0.875em;
    border-left: 4px solid #ccc;
    font-weight: 700;

    background-color: var(--text-background-color);
  }

  // Adjust List Element Style
  ol,
  ul {
    margin: 1.25em 0 1.25em 1.25em;
  }

  // Adjust Horizontal Rule style
  hr {
    border: 1px solid #e5e5e5;
    margin: 1.875em 0;
  }

  // Adjust Link Element Style
  a {
    color: #4263eb;
    text-decoration: underline;
  }

  // Adjust Code Style
  pre[class*='language-'] {
    margin: 1.25em 0;
    padding: 0.875em;
    font-size: 0.875rem;
    border-radius: 4px;

    ::-webkit-scrollbar-thumb {
      background: #ffffff80;
      border-radius: 0.1875em;
    }
  }

  code[class*='language-'],
  pre[class*='language-'] {
    tab-size: 2;
  }

  code[class*='language-text'] {
    color: #e53a40;
    background-color: var(--text-background-color);
    padding: 0.1em 0.4em;
    margin: 0 0.15em;
  }

  .gatsby-resp-image-figcaption {
    color: #757575;
    font-style: italic;
    font-weight: normal;
    margin-top: 0.5em;
    font-size: 0.8rem;
    text-align: center;
  }

  // Markdown Responsive Design
  @media (max-width: 48rem) {
    width: 100%;
    padding: 1.25em 0;
    line-height: 1.6;
    font-size: 0.875rem;

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    h3 {
      font-size: 1rem;
    }

    img {
      width: 100%;
    }

    hr {
      margin: 1.25em 0;
    }
  }
`

const PostContent = ({ html }: { html: string }) => {
  return <MarkdownRenderer dangerouslySetInnerHTML={{ __html: html }} />
}

export default PostContent
