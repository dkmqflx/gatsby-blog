import React from 'react'
import { Link } from 'gatsby'
import { PostFrontmatterType } from 'types/post.types'
import styled from '@emotion/styled'

type PostItemProps = PostFrontmatterType & {
  link: string
  readingTime: { text: string }
}

const PostItem = ({ title, date, link, readingTime }: PostItemProps) => {
  return (
    <PostItemWrapper to={link}>
      <Title>{title}</Title>

      <InfoWrapper>
        <Info>{date}</Info>
        <Info>{readingTime.text}</Info>
      </InfoWrapper>
    </PostItemWrapper>
  )
}

export default PostItem

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 2.25em 0;

  border-bottom: 1px solid var(--border-color);
  cursor: pointer;

  &:first-of-type {
    border-top: 1px solid var(--border-color);
  }
`

const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.375rem;
  font-weight: 500;

  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 48rem) {
    font-size: 1.25rem;
  }
`

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.625em;
  margin-bottom: 1.625em;
`

const Info = styled.div`
  color: var(--secondary-color);
  font-size: 0.875rem;

  @media (max-width: 48rem) {
    font-size: 0.75rem;
  }
`
