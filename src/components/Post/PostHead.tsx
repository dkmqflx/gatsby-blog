import React from 'react'
import styled from '@emotion/styled'
import { PostHeadProps } from 'types/post.types'

const PostHeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.5em 0;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 23.438rem) {
    /* width: 100%; */
    /* padding: 1em; */
    font-size: 0.875rem;

    h1 {
      font-size: 1.5rem;
    }
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
  font-size: 2.5rem;
  font-weight: bold;
`
const PostData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.625em;
  color: var(--secondary-color); ;
`

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
