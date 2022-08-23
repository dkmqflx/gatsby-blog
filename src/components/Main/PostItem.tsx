import React from 'react'
import { Link } from 'gatsby'
import { PostFrontmatterType } from 'types/post.types'
import styled from '@emotion/styled'

type PostItemProps = PostFrontmatterType & {
  link: string
  readingTime: { text: string }
}

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 30px 0;

  border-bottom: 1px solid var(--border-color);
  cursor: pointer;

  &:first-of-type {
    border-top: 1px solid var(--border-color);
  }
`

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4px;
`
const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 24px;
  font-size: 22px;
  font-weight: 600;
`

const Info = styled.div`
  color: var(--secondary-color);
  font-size: 14px;
  min-width: 10%;
`

const Summary = styled.div`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 16px;
  line-height: 30px;
  opacity: 0.8;
  margin-top: 18px;
  color: var(--secondary-color);
`

const PostItem = ({
  title,
  date,
  summary,
  link,
  readingTime,
}: PostItemProps) => {
  return (
    <PostItemWrapper to={link}>
      <TitleWrapper>
        <Title>{title}</Title>
        <Info>{readingTime.text}</Info>
      </TitleWrapper>
      <Info>{date}</Info>
      <Summary>{summary}</Summary>
    </PostItemWrapper>
  )
}

export default PostItem
