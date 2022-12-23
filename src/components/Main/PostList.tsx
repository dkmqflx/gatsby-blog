import React from 'react'
import PostItem from 'components/Main/PostItem'
import { PostListItemType } from 'types/post.types'
import useInfiniteScroll, {
  useInfiniteScrollType,
} from 'hooks/useInfiniteScroll'

type PostListProps = {
  selectedCategory: string
  posts: PostListItemType[]
}

const PostList = ({ selectedCategory, posts }: PostListProps) => {
  const { containerRef, postList }: useInfiniteScrollType = useInfiniteScroll(
    selectedCategory,
    posts,
  )

  return (
    <div ref={containerRef}>
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
    </div>
  )
}

export default PostList
