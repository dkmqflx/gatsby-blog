import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { CategoryListProps } from 'types/main.type'

type CategoryItemProps = {
  active: boolean
}

type GatsbyLinkProps = {
  children: ReactNode
  className?: string
  to: string
} & CategoryItemProps

const CategoryListWrapper = styled.div<{ more: boolean }>`
  display: flex;
  position: relative;
  margin-bottom: 40px;

  flex-wrap: wrap;
  overflow: hidden;
  height: 40px;
`

const CategoryLink = styled(({ active, ...props }: GatsbyLinkProps) => (
  <Link {...props} />
))<CategoryItemProps>`
  background-color: var(--button-color);
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  font-weight: ${({ active }) => (active ? '700' : '400')};

  &:last-of-type {
    margin-right: 0;
  }
`

const Icon = styled.span`
  position: absolute;
  right: 0;
  cursor: pointer;
  color: var(--secondary-color);
  font-weight: bold;
  font-size: 20px;
`

const CategoryList = ({
  selectedCategory,
  categoryList,
}: CategoryListProps) => {
  const [more, setMore] = useState(false)
  const [visible, setVisible] = useState(false)
  const categoryRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null)

  const toggle = useCallback(() => {
    setMore(more => !more)
    if (categoryRef.current) {
      categoryRef.current!.style.height =
        categoryRef.current?.style.height === '40px'
          ? `${categoryRef.current.scrollHeight}px`
          : '40px'
    }
  }, [])

  useEffect(() => {
    if (
      categoryRef.current &&
      categoryRef.current.clientHeight < categoryRef.current.scrollHeight
    ) {
      categoryRef.current.style.height = '40px'
      categoryRef.current.style.transition = 'all 0.3s linear'
      setVisible(true)
    }
  }, [])

  return (
    <CategoryListWrapper more={more} ref={categoryRef}>
      {Object.entries(categoryList).map(([name, count]) => (
        <CategoryLink
          key={name}
          to={`/?category=${name}`}
          active={name === selectedCategory}
        >
          #{name}({count})
        </CategoryLink>
      ))}

      {visible &&
        (more ? (
          <Icon onClick={toggle}>-</Icon>
        ) : (
          <Icon onClick={toggle}>+</Icon>
        ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
