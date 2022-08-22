import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  height: 80px;
`

const Header = () => {
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

  return (
    <HeaderWrapper>
      <Link to="/">
        <h1>{`${author}'s Blog`}</h1>
      </Link>
    </HeaderWrapper>
  )
}

export default Header
