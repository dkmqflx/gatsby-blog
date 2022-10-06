import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'

const Wrapper = styled.footer`
  display: flex;
  justify-content: center;
  padding: 2.5em 0;
  font-size: 0.875rem;
`

const Footer = () => {
  const {
    site: {
      siteMetadata: { author },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author
          }
        }
      }
    `,
  )

  return <Wrapper>{`© 2022 ${author}, Powered By Gatsby`}</Wrapper>
}

export default Footer
