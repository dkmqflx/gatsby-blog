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
import DownArrow from '/static/downArrow.svg'
import UpArrow from '/static/upArrow.svg'

type CategoryItemProps = {
  active: boolean
}

type GatsbyLinkProps = {
  children: ReactNode
  className?: string
  to: string
} & CategoryItemProps

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

  useEffect(() => {
    if (
      categoryRef.current &&
      categoryRef.current.clientHeight < categoryRef.current.scrollHeight
    ) {
      categoryRef.current.style.height = '2.5rem'
      categoryRef.current.style.transition = 'all 0.3s linear'

      const categorLinks = categoryRef.current.querySelectorAll('a')
      categorLinks.forEach(link => (link.style.marginBottom = '0.625em'))

      setVisible(true)
    }
  }, [])

  return (
    <CategoryListWrapper ref={categoryRef}>
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
          <UpArrowIcon onClick={toggle}>-</UpArrowIcon>
        ) : (
          <DownArrowIcon onClick={toggle}>+</DownArrowIcon>
        ))}
    </CategoryListWrapper>
  )
}

export default CategoryList

const CategoryListWrapper = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 4em;

  flex-wrap: wrap;
  overflow: hidden;
  height: 2.5rem;

  @media (max-width: 48rem) {
    margin-bottom: 2em;
  }
`

const CategoryLink = styled(({ active, ...props }: GatsbyLinkProps) => (
  <Link {...props} />
))<CategoryItemProps>`
  background-color: var(--button-color);
  margin-right: 1em;
  padding: 0.5rem;
  border-radius: 0.25rem;

  font-weight: ${({ active }) => (active ? '700' : '400')};

  &:last-of-type {
    margin-right: 0;
  }
`

const UpArrowIcon = styled(UpArrow)`
  position: absolute;
  right: 1em;
  cursor: pointer;

  path {
    stroke: var(--secondary-color);
    fill: var(--secondary-color);
  }
`

const DownArrowIcon = styled(DownArrow)`
  position: absolute;
  right: 1em;
  cursor: pointer;
  path {
    stroke: var(--secondary-color);
    fill: var(--secondary-color);
  }
`
