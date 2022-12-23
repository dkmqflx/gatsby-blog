import React, { ReactNode } from 'react'
import Header from 'components/Common/Header'
import styled from '@emotion/styled'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Wrapper>
      <Header></Header>
      {children}
    </Wrapper>
  )
}

export default Layout

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 64rem;
  min-width: 23.438rem;
  padding: 0 3.75em;

  @media (max-width: 48rem) {
    padding: 0 1em;
    font-size: 0.875rem;
  }
`
