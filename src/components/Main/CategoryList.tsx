import { ReactNode, useMemo } from 'react'
import { Link } from 'gatsby'
import { CategoryListProps } from 'types/main.types'
import { PostListItemType } from 'types/post.types'
import styled from '@emotion/styled'

type CategoryItemProps = {
  active: boolean
}

type GatsbyLinkProps = {
  children: ReactNode
  className?: string
  to: string
} & CategoryItemProps

const CategoryList = ({ selectedCategory, posts }: CategoryListProps) => {
  const categoryList = useMemo(
    () =>
      posts.reduce(
        (
          list: string[],
          {
            node: {
              frontmatter: { categories },
            },
          }: PostListItemType,
        ) => {
          const updatedList = [...list]
          categories.forEach(category => {
            if (!list.includes(category)) updatedList.push(category)
          })
          return updatedList
        },
        ['All'],
      ),
    [],
  )

  return (
    <CategoryListWrapper>
      {categoryList.map(category => (
        <CategoryLink
          key={category}
          to={`/?category=${category}`}
          active={category === selectedCategory}
        >
          {category}
        </CategoryLink>
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList

const CategoryListWrapper = styled.div`
  display: flex;
  position: relative;
  flex-wrap: wrap;

  @media (max-width: 48rem) {
    margin-bottom: 2em;
  }
`

const CategoryLink = styled(({ active, ...props }: GatsbyLinkProps) => (
  <Link {...props} />
))<CategoryItemProps>`
  background-color: var(--button-color);
  margin-right: 1em;
  margin-bottom: 1em;
  padding: 0.5rem;
  border-radius: 0.25rem;

  font-weight: ${({ active }) => (active ? '700' : '400')};

  &:last-of-type {
    margin-right: 0;
  }
`
