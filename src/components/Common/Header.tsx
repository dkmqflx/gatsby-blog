import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import ThemeSwitch from './ThemeSwitch'

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5em;
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
      <ThemeSwitch />
    </HeaderWrapper>
  )
}

export default Header
