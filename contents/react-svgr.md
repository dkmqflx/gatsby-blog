---
date: '2024-01-07'
title: '@svgr/cli을 사용해서 svg 형식의 아이콘을 리액트 컴포넌트로 관리하기'
categories: ['React']
summary: '@svgr/cli를 사용해서 svg 형식의 아이콘을 리액트 컴포넌트로 관리할 수 있는 방법에 대한 글입니다.'
---

## 들어가기에 앞서

크기에 따라 이미지가 왜곡되지 않는다는 장점 때문에 많은 경우에 svg 확장자로 아이콘을 관리합니다.

svg 형식의 아이콘을 다양한 방법으로 관리할 수 있겠지만 여기서는 `@svgr/cli`라는 라이브러리를 사용해서 svg 확장자로 만들어진 아이콘을 리액트 컴포넌트로 다룰 수 있는 방법에 대해서 설명하겠습니다.

---

## @svgr/cli 이란

`@svgr/cli`는 `SVGR`을 커맨드 라인에서 사용할 수 있도록 하는 라이브러리로, 여기서 `SVGR`은 svg를 리액트 컴포넌트로 변환하는 역할을 하는 라이브러리입니다.

즉, `@svgr/cli`을 설치하게 되면 사용자는 명령어를 커맨드 라인에 입력하거나 scripts에 등록해서 svg 파일을 리액트 컴포넌트로 변환할 수 있습니다.

아래 코드는 `@svgr/cli`을 사용해서 svg를 리액트 컴포넌트로 변환한 결과로, svg는 리액트 컴포넌트의 형태로 변환 됩니다.

```tsx
import * as React from 'react'

const SvgComponent = props => (
  <svg width="1em" height="1em" viewBox="0 0 48 1" {...props}>
    <path d="M0 0h48v1H0z" fill="currentColor" fillRule="evenodd" />
  </svg>
)

export default SvgComponent
```

## @svgr/cli을 사용해서 리액트 컴포넌트 만들기

@svgr/cli을 사용해서 리액트 컴포넌트로 변환하기에 앞서 필요한 라이브러리를 설치해줍니다.

```bash
$ npm install --save-dev @svgr/cli
```

설치 후에 아래처럼 명령어를 실행하게 되면 Arrow라는 이름의 컴포넌트가 생성되는 것을 확인할 수 있습니다.

```bash
$ npx @svgr/cli ./public/icons/Arrow.svg
```

### options

svg를 리액트 컴포넌트로 변환하는 과정에서 다양한 옵션을 지정해줄 수 있는데요, 예를들어 변환될 파일이 저장될 경로나 파일 이름의 형식을 정할 수 있습니다.

```bash
$ npx @svgr/cli <아이콘 파일 경로> --out-dir ./src/icons --filename-case pascal

# 리액트 컴포넌트 위치는 src/icons
# 파일 이름 형식은 Pascal로 한다.
```

다양한 옵션들을 이렇게 하나씩 지정하는 대신 아래와 같이 configuration 파일을 통해서 한번에 필요한 옵션들을 지정해줄 수 있습니다.

```js
// .svgrrc.js

module.exports = {
  typescript: true,
  outDir: './src/Icons',
  filenameCase: 'pascal',
  ignoreExisting: true,
}
```

그리고 아래처럼 `-—config-file`이라는 옵션을 사용해서 configuration 파일을 실행해줍니다.

추가적으로 외부에서 props를 통해서 아이콘을 변경하고 싶다면 아래와 같이 svgProps에 width와 height라는 속성을 전달받을 수 있도록 합니다.

```js
const DEFAULT_GRAY_COLOR = `#808080`

module.exports = {
  typescript: true,
  svgProps: {
    width: '{props.width ?? 24}',
    height: '{props.height ?? 24}',
  },

  outDir: './src/Icons',
  filenameCase: 'pascal',
  dimensions: false,
  ignoreExisting: true,
}
```

기본적으로 svg 아이콘은 fill 속성을 사용해서 아이콘의 색상이 정해집니다.

기본 아이콘 색상이 fill 속성에 따라 정해져 있지만 서비스에 따라 기본 아이콘의 색상을 변경하고 싶다면 아래와 같이 replaceAttrValues 옵션을 사용해서 color 속성을 전달받을 수 있도록 해줍니다

```js
const DEFAULT_ICON_COLOR = `#808080`

module.exports = {
  typescript: true,
  svgProps: {
    width: '{props.width ?? 24}',
    height: '{props.height ?? 24}',
  },
  replaceAttrValues: {
    [DEFAULT_ICON_COLOR]: `{props.color ?? "${DEFAULT_ICON_COLOR}"}`,
  },
  outDir: './src/Icons',
  filenameCase: 'pascal',
  dimensions: false,
  ignoreExisting: true,
}
```

```bash
$ npx @svgr/cli <아이콘 파일 경로> --config-file ./.svgrrc.js
```

더 많은 option들은 [공식문서](https://react-svgr.com/docs/options/)에서 확인할 수 있습니다.

### template

앞서 설명한 option들이 svg 파일을 리액트 컴포넌트로 변환하는 과정에서 적용되는 것이라면 template은 변환된 리액트 컴포넌트 결과를 customize 할 때 사용하는 옵션입니다.

즉, template에 작성된 형태로 리액트 컴포넌트가 생성이됩니다.

아래는 template 파일 코드로, comments에 전달된 문자열이 리액트 컴포넌트 import 상단에 작성이 됩니다.

```jsx
// svg-template.js
const comments = `
/* this is comments */
`

const template = (variables, { tpl }) => {
  return tpl`
  ${comments}
  ${variables.imports};
  ${`\n`}
  ${variables.interfaces};
  ${`\n`}

const ${variables.componentName} = (${variables.props}) => (
  
  ${variables.jsx}
);

${variables.exports};
`
}

module.exports = template
```

이렇게 작성된 template 파일은 `--template` 옵션과 함께 사용해줍니다

```bash
$ npx @svgr/cli <아이콘 파일 경로> --config-file ./svgr-config.json --template ./svg-template.js
```

template에 대한 더 많은 설정들은 [공식문서](https://react-svgr.com/docs/custom-templates/)에서 확인할 수 있습니다.

## Icon 컴포넌트로 아이콘 관리하기

위 과정을 통해 작성된 컴포넌트는 `"outDir": "./src/Icons"` 옵션에 따라 `./src/Icons` 폴더 내에 생성이 됩니다.

생성된 아이콘은 아래와 같이 불러와서 사용할 수 있습니다.

```tsx
import React from 'react'

import { ArrowLeft } from './src/Icons'

const Home = () => {
  return (
    <div>
      <ArrowLeft />
    </div>
  )
}

export default Home
```

이와 같은 방법은 사용하는 아이콘이 생길 때 마다 아이콘을 불러오는 import를 계속해서 추가해야 하는 불편함이 있습니다.

```tsx
import React from 'react'

import { ArrowLeft } from './src/Icons'
import { ArrowRight } from './src/Icons'
import { ArrowDown } from './src/Icons'
import { ArrowUp } from './src/Icons'

const Home = () => {
  return (
    <div>
      <ArrowLeft />
      <ArrowRight />
      <ArrowDown />
      <ArrowUp />
    </div>
  )
}

export default Home
```

이러한 문제를 Icon이라는 컴포넌트를 만들고, 해당 컴포넌트를 사용해서 모든 아이콘을 불러오는 방식으로 해결할 수 있습니다.

즉, 외부에서는 Icon 컴포넌트를 사용하는 방식으로 인터페이스를 통일 한다면 필요한 아이콘을 사용할 때 마다 import를 일일이 추가할 필요없이 Icon 컴포넌트 하나만 import 해오면 됩니다.

Icon 컴포넌트 코드는 다음과 같습니다. 이 때 svg에서 변환된 리액트 컴포넌트가 저장되는 폴더와 동일하게 위치하도록 합니다.

```jsx
// ./src/Icon
import React from 'react';

import * as Icons from './Icons';

export type IconName = keyof typeof Icons;

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'name' > & {
  name: IconName; // 외부에서 name이라는 props로 필요한 아이콘을 사용할 수 있도록 합니다.
};

export const Icon = ({ name, ...props }: IconProps) => {
  const Component = Icons[name];

  return <Component {...props} />;
};
```

이렇게 Icon 컴포넌트를 만들어주면 아이콘을 사용할 때 Icon 컴포넌트를 불러온 다음에 name 이라는 props를 통해서 필요한 아이콘을 사용할 수 있습니다.

즉, 이전과 달리 필요한 아이콘을 일일이 import 할 필요 없이 Icon 컴포넌트와 불러와서 사용하면 됩니다.

```jsx
import React from 'react'

import { Icon } from './src/Icon'

const Home = () => {
  return (
    <div>
      <Icon name="ArrowLeft" />
      <Icon name="ArrowRight" />
      <Icon name="ArrowDown" />
      <Icon name="ArrowUp" />
    </div>
  )
}

export default Home
```

---

## 정리

지금까지 `@svgr/cli`를 사용해서 svg를 리액트 컴포넌트로 변환하고, 사용하는 방법에 대해서 다루었습니다.

여기서는 다루지 않은 내용들이 있는데요, svgr에 대해서 더 자세히 알고 싶다면 [공식문서](https://react-svgr.com/)를 참고해주세요
