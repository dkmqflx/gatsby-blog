import React from 'react'
import styled from '@emotion/styled'
import PostItem from 'components/Main/PostItem'
import { PostListItemType } from 'types/post.types'
import useInfiniteScroll, {
  useInfiniteScrollType,
} from 'hooks/useInfiniteScroll'

type PostListProps = {
  selectedCategory: string
  posts: PostListItemType[]
}

const PostListWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
`

const PostList = ({ selectedCategory, posts }: PostListProps) => {
  const { containerRef, postList }: useInfiniteScrollType = useInfiniteScroll(
    selectedCategory,
    posts,
  )

  return (
    <PostListWrapper ref={containerRef}>
      {postList.map(
        ({
          node: {
            id,
            fields: { slug, readingTime },
            frontmatter,
          },
        }: PostListItemType) => (
          <PostItem
            {...frontmatter}
            link={slug}
            key={id}
            readingTime={readingTime}
          />
        ),
      )}
    </PostListWrapper>
  )
}

export default PostList
