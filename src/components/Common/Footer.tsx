import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'

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

const Wrapper = styled.footer`
  display: flex;
  justify-content: center;
  padding-top: 6.25em;
  padding-bottom: 3.125em;
  font-size: 0.875rem;
`
