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
  padding: 0 3.75em;
`
