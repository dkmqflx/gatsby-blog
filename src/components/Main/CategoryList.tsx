import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'gatsby'
import { CategoryListProps } from 'types/main.types'
import styled from '@emotion/styled'

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
  margin-bottom: 2.5em;

  flex-wrap: wrap;
  overflow: hidden;
  height: 2.5rem;
`

const CategoryLink = styled(({ active, ...props }: GatsbyLinkProps) => (
  <Link {...props} />
))<CategoryItemProps>`
  background-color: var(--button-color);
  font-size: 0.875rem;
  margin-right: 0.625em;
  margin-bottom: 0.625em;
  padding: 0.625em;
  border-radius: 0.25em;
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
  font-size: 1.25rem;
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

    if (typeof window !== 'undefined' && categoryRef.current) {
      const fontSize = Number(
        window
          .getComputedStyle(document.body)
          .getPropertyValue('font-size')
          .match(/\d+/)![0],
      )

      categoryRef.current!.style.height =
        categoryRef.current?.style.height === '2.5rem'
          ? `${categoryRef.current.scrollHeight * (1 / fontSize)}rem`
          : '2.5rem'
    }
  }, [])

  // console.log(categoryRef.current)

  useEffect(() => {
    if (
      categoryRef.current &&
      categoryRef.current.clientHeight < categoryRef.current.scrollHeight
    ) {
      categoryRef.current.style.height = '2.5rem'

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
          {name}({count})
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
