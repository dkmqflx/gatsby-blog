import React from 'react'
import styled from '@emotion/styled'
import { PostHeadProps } from 'types/post.types'

const PostHead = ({ title, date, categories }: PostHeadProps) => {
  return (
    <PostHeadWrapper>
      <Title>{title}</Title>
      <PostData>
        <div>{categories.join(' / ')}</div>
        <div>{date}</div>
      </PostData>
    </PostHeadWrapper>
  )
}

export default PostHead

const PostHeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3em 0;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 23.438rem) {
    padding-top: 0;
    padding-bottom: 1.5em;
  }
`

const Title = styled.h1`
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 2.25rem;
  font-weight: 800;

  @media (max-width: 23.438rem) {
    font-size: 1.875rem;
  }
`

const PostData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.625em;
  color: var(--secondary-color); ;
`
