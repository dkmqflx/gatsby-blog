import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import Footer from 'components/Common/Footer'
import GlobalStyle from 'components/Common/GlobalStyle'
import styled from '@emotion/styled'

type TemplateProps = {
  title: string
  description: string
  url: string
  image: string
  author: string
  children: ReactNode
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
`

const Template = ({
  title,
  description,
  url,
  image,
  author,
  children,
}: TemplateProps) => {
  return (
    <Container>
      <Helmet>
        <title>{title}</title>

        <meta
          name="google-site-verification"
          content="ZMqhg3FRmL_SyoEv-hk5Bepv1SImbOwbqDi5fC05mM4"
        />

        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={title} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content={author} />
        <meta name="twitter:creator" content={author} />

        <html lang="ko" />
      </Helmet>
      <GlobalStyle />
      {children}
      <Footer />
    </Container>
  )
}

export default Template
