import React, { ReactNode } from 'react'
import Header from 'components/Common/Header'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 48em;
  padding: 1.5em 0;

  @media (max-width: 23.438rem) {
    width: 100%;
    padding: 1em;
    font-size: 0.875rem;

    h1 {
      font-size: 1.5rem;
    }
  }
`

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Wrapper>
      <Header></Header>
      {children}
    </Wrapper>
  )
}

export default Layout
