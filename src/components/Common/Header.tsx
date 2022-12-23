import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import ThemeSwitch from './ThemeSwitch'

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
        <HeaderTitle>{`${author}'s Blog`}</HeaderTitle>
      </Link>
      <ThemeSwitch />
    </HeaderWrapper>
  )
}

export default Header

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3.75em;
  height: 5rem;
  margin-bottom: 2.75em;
`

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
`
