import React from 'react'
import { Link } from 'gatsby'
import GlobalStyle from 'components/Common/GlobalStyle'
import styled from '@emotion/styled'
import PageNotFound from '/static/pageNotFound.svg'

const NotFoundPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const NotFoundText = styled.div`
  font-size: 150px;
  font-weight: 700;
`

const NotFoundDescription = styled.div`
  font-size: 24px;
  text-align: center;
  line-height: 1.2;
`

const GoToMainButton = styled(Link)`
  margin-top: 30px;
  font-size: 20px;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`

const NotFoundPage = () => {
  return (
    <NotFoundPageWrapper>
      <GlobalStyle />
      <PageNotFound />
      <NotFoundText>404</NotFoundText>
      <NotFoundDescription>찾을 수 없는 페이지입니다.</NotFoundDescription>
      <GoToMainButton to="/">메인으로</GoToMainButton>
    </NotFoundPageWrapper>
  )
}

export default NotFoundPage
