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
  margin-bottom: 2.75em;
  height: 5rem;

  @media (max-width: 48rem) {
    margin-top: 2em;
    margin-bottom: 1.5em;
    height: 3rem;
  }
`

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;

  @media (max-width: 48rem) {
    font-size: 1.625rem;
  }
`
