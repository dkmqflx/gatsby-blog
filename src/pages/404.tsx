import React from 'react'
import { Link } from 'gatsby'
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
  font-size: 9.375rem;
  font-weight: 700;
`

const NotFoundDescription = styled.div`
  font-size: 1.5rem;
  text-align: center;
  line-height: 1.2;
`

const GoToMainButton = styled(Link)`
  margin-top: 1.875em;
  font-size: 1.25rem;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`

const NotFoundPage = () => {
  return (
    <NotFoundPageWrapper>
      <PageNotFound />
      <NotFoundText>404</NotFoundText>
      <NotFoundDescription>찾을 수 없는 페이지입니다.</NotFoundDescription>
      <GoToMainButton to="/">메인으로</GoToMainButton>
    </NotFoundPageWrapper>
  )
}

export default NotFoundPage
