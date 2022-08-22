import React, { ReactNode } from 'react'
import Header from 'components/Common/Header'
import Footer from 'components/Common/Footer'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  margin: 0 auto;
  width: 768px;
  padding: 20px 0;
`

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Wrapper>
      <Header></Header>
      {children}
      <Footer></Footer>
    </Wrapper>
  )
}

export default Layout