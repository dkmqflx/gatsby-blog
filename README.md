## 블로그를 만들게 된 계기

- 기존에는 Jekyll 기반으로 만든 블로그를 사용하고 있었습니다.
- Jekyll은 Ruby 기반으로 Ruby 언어에 대한 지식이 없었기 때문에 새로운 기능을 추가하거나 UI를 수정하는데 있어 어려움이 있었습니다.
- 이러한 점 때문에 익숙한 리액트로 블로그를 개발할 수 있는 정적 사이트 생성 프레임워크인 `Gatsby`를 사용해서 새로운 블로그를 만들었습니다.
- 그리고 블로그를 만들기에 앞서 [Figma](https://www.figma.com/file/Zvs6EwHvq7VKxmk6H3LfKx/%EB%B8%94%EB%A1%9C%EA%B7%B8-UI?node-id=0%3A1)를 통해 기본적인 디자인 작업을 하였고 이를 기반으로 개발을 하였습니다


<br/>


## 블로그를 만들면서 고민했던 점들

### 1. 다크모드

- 다크모드 같은 경우 전력 소모 및 눈의 피로를 줄여준다는 점에서 보편적인 기능으로 자리잡고 있습니다.
- 이전 블로그에는 다크모드 기능이 없었기 때문에 새로 블로그를 개발하면서 다크모드 기능을 구현하였습니다.

- `window.matchMedia()` 함수와 `prefers-color-scheme` 속성을 사용해서 사용자의 시스템 설정에 따라 다크모드 또는 라이트모드가 적용되도록 하였고 테마 값을 로컬 스토리지에 값을 저장해주는 방식으로 구현했습니다

```jsx
// gatsby-ssr.js

// Called after every page Gatsby server renders while building HTML
export const onRenderBody = ({ setPreBodyComponents }) =>
  setPreBodyComponents([
    <script
      key="theme"
      dangerouslySetInnerHTML={{
        __html: `(() => {
        try {
          const blogTheme =
            localStorage.getItem('blog_theme') 

          const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

          const setTheme = (theme) => {
            document.body.classList.add(theme)
            localStorage.setItem('blog_theme', theme) 
          }

          setTheme(blogTheme || prefersColorScheme)

        } catch (error) {}
      })()`,
      }}
    />,
  ])
```

- 처음에는 `Emotion`에서 제공하는 `Global` 컴포넌트안에 클래스를 정의한 다음 라이트모드, 다크모드 스타일이 적용되도록 하였습니다
- 하지만 다크모드로 설정한 다음 새로고침을 하면 라이트모드가 적용된 후 다크모드가 적용되면서 깜빡이는 현상이 나타났는데 그 이유는 사용자의 설정을 확인하고 적용하기 전에 HTML이 생성되었기 때문입니다.
- 즉, 기본 테마를 라이트모드로 설정한 후 배포를 했기 때문에 라이트모드가 우선적으로 적용된 다음 사용자가 설정한 다크모드가 적용되었던 것입니다.
- 따라서 이 문제를 해결하기 위해 `Emotion`의 `Global` 컴포넌트 대신 global.css 파일에 CSS 커스텀 속성(CSS Custom Properties)을 정의해주었고 필요한 곳에서 해당 값들을 사용하는 방식으로 문제를 처리했습니다.

```css
/* styles/glboal.css */

body {
  transition: background-color 0.3s linear;
}

body.light {
  background-color: #f5f5f5;
  color: #161616;
  --secondary-color: #6c6c6c;
  --button-color: #ececec;
  --border-color: #c6c3c3ca;
  --text-background-color: #dfdddd;
}

body.dark {
  background-color: #202122;
  color: #fff;
  --secondary-color: #bec1c5;
  --button-color: #303134;
  --border-color: #3d4043;
  --text-background-color: #908d8d1e;
}
```

<br/>

- 다크모드를 구현하는데 있어 또 하나 고려해야할 점은 바로 댓글 기능에서도 다크모드가 적용되야 하는 것이었습니다.
- `Utterance`를 사용해서 댓글을 달 수 있는 기능을 구현했는데, 사용자가 다크모드를 선택했을 때 그에 맞게 테마가 바뀌어야 했습니다.
- 여러가지 방법이 있었지만 블로그를 개발하는 것에 학습의 목적 또한 있었기 때문에 이번 기회에 `Recoil`을 학습하고 적용해보았습니다.
- 아래처럼 `Recoil`을 사용해서 전역 상태를 관리하는 Custom hook을 정의해주었습니다.
- Header 컴포넌트에 위치한 값을 전구 모양의 아이콘을 클릭했을 때 전역 상태의 값이 바뀌고, 그에 따라 Utterance의 테마가 바뀌도록 처리하였습니다.

```jsx
// hooks/useTheme.tsx

import { useEffect } from 'react'
import { DARK_THEME, LIGHT_THEME, BLOG_THEME } from 'constants/theme'
import { atom, useRecoilState } from 'recoil'

type ThemeType = 'dark' | 'light'

export const initialTheme = atom({
  key: 'theme',
  default: '',
})

const useTheme = () => {
  const [theme, setTheme] = useRecoilState(initialTheme)

  const toggleTheme = (theme: ThemeType) => {
    switch (theme) {
      case DARK_THEME:
        localStorage.setItem(BLOG_THEME, DARK_THEME)
        document.body.classList.add(DARK_THEME)
        document.body.classList.remove(LIGHT_THEME)

        setTheme(DARK_THEME)
        break
      case LIGHT_THEME:
        localStorage.setItem(BLOG_THEME, LIGHT_THEME)
        document.body.classList.add(LIGHT_THEME)
        document.body.classList.remove(DARK_THEME)

        setTheme(LIGHT_THEME)

        break
      default:
        break
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(document.body.classList.value)
    }
  }, [])

  return { theme, toggleTheme }
}

export default useTheme
```

```jsx
// PostUtterance.tsx

...

const theme = useRecoilValue(initialTheme) // 전역 상태 값을 받아온다

const changeUtterance = () => {
    const message = {
      type: 'set-theme',
      theme: theme === DARK_THEME ? 'github-dark' : 'github-light', // 사용자가 설정한 모드에 따라 Utterance 테마 적용되도록 처리
    }
    const iframe = document.querySelector<HTMLIFrameElement>(UTTERANCE_CLASS)

    iframe?.contentWindow?.postMessage(message, src)
  }

...
```

---

<br/>

### 2.무한 스크롤

- 이전 블로그 같은 경우에는 전에 작성된 글을 보기 위해서는 버튼을 눌러 다른 페이지로 이동하는 방식이었습니다.
- 하지만 추가 클릭 없이 새로운 포스트를 확인할 수 있기 때문에 더 나은 사용성을 제공할 수 있다는 점에서 `IntersectionObserver`을 사용해서 무한 스크롤 기능을 적용해주었습니다.
- 아래는 무한 스크롤 기능을 위한 Custom hook으로 return 값 중 하나인 `postList` 에서 새롭게 불러온 글들이 반환됩니다.

```jsx
// hooks/useInfiniteScroll.tsx

import { MutableRefObject, useState, useEffect, useRef, useMemo } from 'react'
import { PostListItemType } from 'types/post.types'

export type useInfiniteScrollType = {
  containerRef: MutableRefObject<HTMLDivElement | null>
  postList: PostListItemType[]
}

const NUMBER_OF_ITEMS_PER_PAGE = 10 // 페이지당 사용자에게 보여질 블로그 글 갯수

const useInfiniteScroll = function (
  selectedCategory: string,
  posts: PostListItemType[],
): useInfiniteScrollType {
  const containerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null)

  const observer: MutableRefObject<IntersectionObserver | null> =
    useRef<IntersectionObserver>(null)

  const [count, setCount] = useState<number>(1) // 무한 스크롤을 통해 새로운 데이터 불러올 때 마다 값을 증가시켜주기 위한 state

	// category에 의해 선택되는 post list, 사용자에게 보여지는 글 목록
  const postListByCategory = useMemo<PostListItemType[]>(
    () =>
      posts.filter(
        ({
          node: {
            frontmatter: { categories },
          },
        }: PostListItemType) =>
          selectedCategory !== 'All'
            ? categories.includes(selectedCategory)
            : true,
				// 카테고리가 All이면 그냥 true로 모든 포스트 보여지도록
				// All이 아니면 해당 카테고리에 해당하는 포스트만 보여지도록
      ),
    [selectedCategory],
  )

  useEffect(() => {
    observer.current = new IntersectionObserver((entries, observer) => {
			// observer는 관측대상으로 단 하나의 요소만 관측할 것이기 때문에 관측 요소 배열 파라미터에 해당하는 entries 인자에는 하나의 데이터만 존재한다.
			// entries에는 entries는 IntersectionObserverEntry 인스턴스의 배열로, 관측하는 요소들의 정보가 들어있다
      
			if (!entries[0].isIntersecting) return
			// isIntersecting이라는 프로퍼티를 통해 화면에 노출되었는지를 확인할 수 있다.
			// isIntersecting: 관찰 대상의 교차 상태(Boolean)
			// 포스트에서 가장 마지막 요소를 관측하고 있는데 화면에 보이지 않으면 아래 코드 실행하지 않고 종료

			// 만약 화면에 보인다면 그 순간 아래 코드 실행해준다
      setCount(value => value + 1)
      observer.unobserve(entries[0].target) // 타겟 요소 관측 중단
    })
  }, [])

  useEffect(() => setCount(1), [selectedCategory]) // 카테고리가 바뀔 때 마다 값을 1로 초기화해준다

  useEffect(() => {
    if (
      NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCategory.length ||
      containerRef.current === null ||
      containerRef.current.children.length === 0 ||
      observer.current === null
    )
      return
	
		// 타겟 요소 관측 시작
    observer.current.observe(
      containerRef.current.children[containerRef.current.children.length - 1],
    )
	// 처음에는 All 카테고리가 선택되니까, All 카테고리의 10개의 postList가 리턴되어 있다.
	// 그 요소중에서 가장 마지막 요소를 observe 하는 것
  }, [count, selectedCategory])

  return {
    containerRef,
    postList: postListByCategory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
  }
	// 화면에 보이는지 체크하기 위한 특정 요소를 선택하기 위해, 상위 요소인 PostListWrapper를 연결해야합니다.
	// 이를 위해 사용하는 Hook이 useRef이며, 다음과 같이 커스텀 훅에서 ref를 선언한 후 반환값에 추가해줍시다. (containerRef)
}

export default useInfiniteScroll

```

---

<br/>

### 3. 반응형

- 이전 블로그를 운영할 때 Google Search Console을 통해 검색 실적을 확인해 보면 모바일 기기를 사용해 블로그에 접속한 사용자들도 있었습니다
- 그렇기 때문에 모바일 기기를 사용해서 블로그에 접근했을 때도 대응할 수 있도록 반응형 처리를 해주었고 화면 크기에 따라 다른 폰트 사이즈 및 Padding 값이 적용되도록 했습니다.

---

- 이 외에 작성된 포스트 마다 reading time을 표시해서 글을 읽는데 소요되는 시간을 대략적으로 알 수 있도록 하였고
- 포스트에 코드를 embed 할 수 있는 기능을 추가해서 작성된 코드를 직접 실행해볼 수 있도록 하였습니다.
