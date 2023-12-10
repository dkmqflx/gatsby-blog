---
date: '2023-12-10'
title: '코드 컨벤션을 지키기 위한 프론트엔드 개발 환경만들기 (husky, commitlint, lint, prettier, stylelint)'
categories: ['Env']
summary: '코드 컨벤션을 지키기 위한 프론트엔드 개발 환경에 대해서 정리한 글입니다.'
---

## 배경

우리는 원활한 협업을 위해 다양한 규칙을 정합니다. 커밋 메시지 작성 방법부터 브랜치 전략까지 다양한 측면에서 규칙을 정하고 이를 준수하기 위해 노력합니다.

규칙을 모든 팀원이 따르도록 하기 위해 문서화를 진행하기도 하지만, 개발은 결국 사람이 수행하는 작업이기에 의도치 않게 규칙을 어기는 경우가 종종 발생합니다.

이러한 문제들이 반복되면서, 이를 미리 방지할 수 없을까 하는 고민이 생겼습니다. 여러 도구들을 활용하여 팀원들이 문서에 의존하지 않고도 규칙을 지킬 수 있는 환경을 만들게 되었고 이러한 경험에서 얻은 방법들을 공유하고자 합니다.

---

## Git Hooks

필요한 도구들을 도입하기에 앞서 우선 [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)에 대한 이해가 필요합니다.

Git Hooks는 Git 과 관련한 어떤 이벤트가 발생했을 때 자동으로 실행되는 스크립트로 커밋 메세지를 작성하거나 원격 저장소에 push 할 때와 같이 특정 시점에 원하는 동작이 실행되도록 할 수 있습니다.

Git 저장소에서 아래와 같은 경로를 통해 다양한 Hook들을 확인할 수 있습니다.

```bash

$ cd .git/hooks

$ ls -a

# 아래와 같이 다양한 hook이 있는 것을 확인할 수 있습니다.
applypatch-msg.sample     post-update.sample        pre-merge-commit.sample   pre-receive.sample        update.sample
commit-msg.sample         pre-applypatch.sample     pre-push.sample           prepare-commit-msg.sample
fsmonitor-watchman.sample pre-commit.sample         pre-rebase.sample         push-to-checkout.sample

```

실행하려는 Hook 파일에 `.sample` 확장자를 제거하면 Hook을 실행할 수 있습니다.

예를들어 `pre-commit` hook은 커밋할 때 가장 먼저 호출되는 hook으로, 커밋 메시지를 작성하기 전에 실행하고 싶은 명령어가 있다면 `pre-commit.sample` 파일을 `pre-commit`이라고 변경한 다음 파일 내부에 실행시키고자 하는 명령어를 작성해주면 됩니다.

아래처럼 스크립트 파일 내부에 명령어를 작성한 다음 커밋을 하면 `“pre-commit!”`이 출력되는 것을 확인할 수 있습니다.

```tsx
// pre-commit

echo "pre-commit!"

```

다양한 Hook 파일에 상황에 따라 동작할 명령어를 작성할 수 있지만 이 파일들은 `.git` 폴더 내부에 있기 때문에 원격저장소에 올릴 수 없습니다.

그렇기 때문에 팀 내부에서 공통적으로 사용하는 Hook이 있는 경우 각각의 팀원이 직접 Hook을 작성해야 하는 불편함이 있는데 이러한 문제를 해결할 수 있는 도구가 바로 **Husky** 입니다.

<br/>

## Husky

Husky는 Git hooks를 쉽게 사용할 수 있게 도와주는 라이브러리입니다.

아래와 같이 husky를 설치하고나면 `.husky` 라는 폴더가 생성된 것을 확인할 수 있는데 해당 폴더 내에 실행시키고자 하는 Hook 파일을 만들면 Git Hooks와 동일하게 사용할 수 있습니다.

```bash
$ npx husky-init && npm install
```

예를들어 커밋 메시지를 작성하기 전에 호출되는 `pre-commit` 파일을 생성한 다음 아래와 같은 명령어를 작성하면, Git Hooks를 사용할 때와 동일하게 커밋 메세지를 작성 후에 `“huksy pre-commit!”`이 출력되는 것을 확인할 수 있습니다.

```bash
# huksy/pre-commit

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "husky pre-commit!"
```

이렇게 작성한 파일들은 Git Hooks을 사용할 때와 달리 원격 저장소에 올릴 수 있기 때문에 팀에서 공통으로 사용하는 Hook을 공유할 수 있습니다.

<br/>

## Git flow 지키기

이제 Husky를 사용해서 어떻게 Git flow를 지킬 수 있는지 알아보겠습니다.

Git flow 방식으로 브랜치를 관리하자고 팀 내부적으로 정했더라도, develop, stage, master 브랜치에 실수로 직접 push를 하는 경우가 발생할 수 있습니다.

Husky를 사용하면 특정한 브랜치에 직접 push 하는 것을 막을 수 있습니다. 아래처럼 pre-push라는 Hook을 생성하고 명령어를 작성해 줍니다. pre-push hook은 말 그대로 git push 명령어를 입력했을 때 실행되는 Hook으로 커밋된 파일을 원격에 올리기 전에 실행됩니다.

```bash
# pre-push

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "master" ] || [ "$branch" = "stage" ] || [ "$branch" = "develop" ] ; then
  echo "$branch 브랜치에 직접 push 할 수 없습니다."
  exit 1
fi
```

이렇게 설정해 준 다음 master 직접 push를 하면 아래처럼 해당하는 브랜치에 직접 push 할 수 없다는 명령어가 출력되는 것을 확인할 수 있습니다.

```bash
$ git push origin master

# master 브랜치에 직접 push 할 수 없습니다.
```

<br/>

## Commitlint

커밋의 목적을 명확하게 나타내고 협업을 원활하게 하기 위해 커밋 컨벤션을 정합니다. type으로 허용되는 키워드, subject의 사용 유무와 같은 여러 컨벤션을 정하지만 실제로 커밋 메시지를 보면 컨벤션을 지키지 않는 경우가 많습니다.

이 때 Commitlit라는 도구를 도입하면 커밋 명령어를 작성할 때 컨벤션을 강제하기 때문에 커밋 컨벤션이 지켜지지 않는 상황을 사전에 막을 수 있습니다.

우선 공식문서에 따라 [Commitlint](https://commitlint.js.org/#/guides-local-setup?id=guide-local-setup)를 설치한 다음, 설정 파일을 생성하는 명령어를 실행합니다.

```bash
# Install and configure if needed
npm install --save-dev @commitlint/{cli,config-conventional}

# Configure commitlint to use conventional config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

명령어를 실행하고 나면 `commitlint.config.cjs` 파일이 생성되는데 해당 파일에서 필요한 설정을 추가해줄 수 있습니다.

예를들어 **“커밋의 type으로는 `feat`, `fix`, `chore`, `refactor`, `test`만 사용될 수 있다”** 라는 컨벤션이 있다면 아래와 같이 rule을 추가해줍니다.

```jsx
module.exports = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'style', 'chore', 'refactor', 'test'],
    ],
  },
}
```

여기서 각각의 rule은 배열로 **Level, Applicable, Value**라는 세가지 값을 전달받는데 각각의 역할은 다음과 같습니다.

- **Level**
  - 규칙의 level을 정하는 값으로 0, 1, 2를 가질 수 있습니다.
  - 0은 rule을 비활성화하고 1은 경고, 2는 오류로 처리합니다.
- **Applicable**
  - `’always'` 또는 `'never'` 값을 가질 수 있습니다.
  - `never`는 규칙을 반전시킵니다.
- **Value**
  - rule에 규칙에 사용할 값입니다.

rule을 추가 한 다음 huksy 폴더 내부에 commit-msg 파일을 생성하고 아래처럼 명령어를 작성해줍니다.

```bash
# husky/commit-msg

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "commit 컨벤션을 체크합니다."
npx commitlint --edit $1
```

commit-msg hook은 커밋 하기에 앞서 실행되는 Hook으로, 이전에 rule로 정해준 규칙에 위배된 커밋 메시지를 작성하게 되면 커밋이 되지 않습니다.

만약 아래처럼 커밋 메시지를 작성하면 아래와 같이 에러메시지가 나타나는 것을 확인할 수 있습니다.

```bash
$ git commtit -m 'Feat: 1'

# commit 컨벤션을 체크합니다.
# ⧗   input: Feat: 1
# ✖   type must be lower-case [type-case]
# ✖   type must be one of [feat, fix, style, chore, refactor, test] [type-enum]
```

이 외에도 [공식문서의 Rules 페이지](https://commitlint.js.org/#/reference-rules)를 보면 다양한 규칙들이 있는데 이러한 규칙들을 상황에 맞게 적용할 수 있습니다.

<br/>

## ESLint & lint-staged

ESLint는 ECMAScript 코드에서 문제점을 검사하는 Lint 도구 중 하나입니다.

ESLint를 사용해서 코딩 컨벤션에 어긋나는 오류나 버그를 사전에 찾을 수 있고 일관된 코드 스타일을 유지할 수 있습니다.

ESLint를 설치 후 Configuration 파일 내부에서 다양한 설정을 해줄수 있습니다. 많은 키워드들이 있지만 extends, plugins, rules에 대해서 우선 이해를 하는게 중요한데, 각각의 키워드는 다음과 같은 역할을 합니다.

- **rules**

  - rules 객체는 말 그대로 적용될 규칙들을 추가할 수 있는 객체입니다.

- **plugins**

  - ESLint에서 제공하는 기본적인 규칙 이외에도 다양한 규칙을 적용하고 싶은 경우 플러그인을 사용할 수 있습니다. 다만 주의할 점은 plugins의 배열 요소에 설치한 플러그인을 추가한다고 해서 자동으로 규칙들이이 적용되는 것이 아니라 플러그인에 있는 규칙들을 rules 객체에 추가해주어야 합니다.

- **extends**

  - 이렇게 rules에 일일이 규칙을 추가하는 것은 번거로울 수 있습니다. 이 때 사용할 수 있는게 extends 입니다. extends 배열에 설정 파일 관련된 패키지를 추가만 해주면 rules에 별도로 규칙을 추가할 필요 없이 규칙들을 바로 적용할 수 있습니다.

아래와 같이 Configuration 파일에 필요한 설정을 추가할 수 있습니다.

```jsx
// eslintrc.js
module.exports = {
	...
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],

	...
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
  },
};
```

이렇게 설정한 규칙들을 Husky와 함께 사용해서 커밋 할 때 규칙에 맞게 코드를 작성했는지 확인할 수 있습니다. 하지만 Lint가 모든 파일을 대상으로 적용된다면 현재 작업과 무관한 파일에도 규칙이 적용될 수 있고 프로젝트 규모가 커질수록 실행 속도에 영향을 미칠 수 있습니다.

이러한 문제를 lint-staged를 사용해서 해결할 수 있는데 lint-staged는 stage 상태의 파일에만 lint가 적용될 수 있도록 도와주는 라이브러리로, pre-commit hook과 함께 사용하면 커밋할 때 lint 규칙이 적용되도록 할 수 있습니다.

ESLint가 설치되어 있는 상황에서 추가적으로 linst-staged를 설치해줍니다.

```bash
$ npm install --save-dev lint-staged
```

설치 후 package.json에 스크립트와 lint가 적용될 파일의 확장자를 아래처럼 명시해줍니다.

```json
{
	...

	"lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ]
  },
	...
}
```

추가적으로 pre-commit hook에 위의 스크립트를 실행하는 코드를 추가해줍니다.

```bash
# husky/pre-commit.sh

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "commit 이전에 lint 규칙을 적용합니다"
npx lint-staged
```

그리고 나서 커밋을 하게 되면 staged 된 파일들을 대상으로만 lint가 적용되기 때문에 모든 파일을 대상으로 lint를 검사 했을 때 보다 더 빠르게 커밋을 완료할 수 있습니다.

지금까지는 husky를 사용해서 특정한 시점에 동작을 처리해서 컨벤션을 지킬 수 있는 방법에 대해 알아보았습니다. 이번에는 husky를 사용하지는 않지만 컨벤션을 지킬 수 있는 방법들을 소개하겠습니다.

<br/>

## Prettier

Prettier는 일관된 코드 스타일을 유지하게 해주는 코드 포맷터 입니다. 앞서 설명한 ESLint도 일관된 코드 스타일을 유지할 수 있도록 도와주는 코드 포맷팅 역할을 한다고 했는데요, Prettier가 코드 포맷팅에 더 특화되어 있는 만큼 보통 ESLint를 Prettier와 함께 사용합니다. Prettier는 주로 코드 스타일의 일관성을 유지하고 ESLint는 코드 품질과 잠재적인 버그를 검사하는 데 사용됩니다.

Prettier를 사용하기 위해 아래처럼 prettier를 설치해줍니다.

```bash
$ npm install --save-dev --save-exact prettier
```

그리고 아래처럼 설정 파일에 필요한 속성을 추가해줍니다.

```jsx
// .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120
}
```

파일을 저장할 때 실시간으로 포맷팅을 하기 위해 Prettier 익스텐션을 설치한 다음 vscode 설정 파일에 아래와 같이 Prettier를 기본 포맷터로 하고 저장할 때 마다 실행되도록 하는 설정을 추가해줍니다.

```jsx
// .vscode/settings.json
{
	"editor.defaultFormatter": "esbenp.prettier-vscode"
	"editor.formatOnSave": true
}
```

이렇게 설정해주게 되면 Prettier의 설정에 맞지 않게 코드를 작성하더라도 저장할 때 코드가 자동으로 포맷팅이 되는 것을 확인할 수 있습니다.

여기서 주의할 점은 ESLint도 코드 포맷팅의 역할을 하기 때문에 Prettier와 충돌이 발생할 수가 있습니다. 따라서

`eslint-config-prettier` 라이브러리를 설치해서 ESLint에서 Prettier와 충돌할 수 있는 rule을 꺼줍니다.

```jsx
{
  "extends": ["prettier"]
	// eslint-config-*와 같은 형식을 갖는 패키지는 eslint-config 부분은 생략할 수 있습니다.
}
```

<br/>

## Stylelint

아래는 스타일 관련된 컨벤션이 없는 상황에서 styled-components를 사용해서 스타일을 적용한 코드입니다.

Box라는 컴포넌트를 스타일링 할 때 누군가는 width를 먼저 작성할 수 있지만 또 사람은 height를 먼저 작성할 수 있습니다.

```jsx
// styled-components

const Box = styled.div`
  width: 200px;
  height: 200px;

  padding-left: 20px;
  padding-right: 20px;
  font-size: 12px;
  line-height: 20px;
  border-top: 1px solid black;
`

const Box = styled.div`
  height: 200px;
  width: 200px;

  padding-left: 20px;
  padding-right: 20px;
  font-size: 12px;
  line-height: 20px;
  border-top: 1px solid black;
`
```

이렇게 작성하는 방식이 다양하다면 코드의 양이 늘어날수록 가독성의 문제는 더욱 심각해질 것입니다. 스타일 코드의 수가 늘어나게 되면 개행을 사용해서 구분을 지을 수 있겠지만 개행을 하는 기준 또한 사람마다 달라 근본적인 해결책이 되지는 못합니다.

이 때 사용할 수 있는 것이 Stylelint입니다. Stylelint는 스타일 파일에 컨벤션을 적용할 수 있는 라이브러리로 Stylelint를 사용하면 스타일 관련된 코드에도 컨벤션을 적용할 수 있습니다.

styled-components 사용하는 경우를 가정하고 아래와 같이 필요한 라이브러리를 설치해줍니다

```bash
npm -D stylelint
			 stylelint-order
			 stylelint-config-standard
			 stylelint-config-recess-order
			 postcss-styled-syntax
```

기본적으로 설치해야 하는 stylelint와 stylelint-config-standard 이외의 나머지 패키지는 다음과 같은 역할을 합니다

- **stylelint-order**
  - CSS 속성의 순서와 관련된 lint 규칙을 모아놓은 플러그인으로 아래 stylelint-config-recess-order와 함께 사용합니다.
- **stylelint-config-recess-order**
  - **[Recess](https://github.com/twitter-archive/recess/blob/29bccc870b7b4ccaa0a138e504caf608a6606b59/lib/lint/strict-property-order.js)** 방식대로 CSS 속성의 순서를 정렬할 수 있는 라이브러리
- **postcss-styled-syntax**
  - CSS-in-JS에서 PostCSS 문법을 사용할 수 있는 라이브러리
  - stylelint와 styled-components를 함께 사용할 때 cssSyntaxError가 발생하는 경우가 있는데 stylelint의 customSynstax 옵션에 추가해주면 이를 해결할 수 있습니다.

라이브러리를 설치한 다음 Stylelint 설정파일을 만들고 아래와 같이 코드를 작성해줍니다.

```js
// .stylelintrc.js
const propertyGroups = require('stylelint-config-recess-order/groups')

module.exports = {
  customSyntax: 'postcss-styled-syntax',
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-order': propertyGroups.map(group => ({
      ...group,
      emptyLineBefore: 'always',
      noEmptyLineBetween: true,
    })),
    'declaration-empty-line-before': null,
  },
}
```

여기서 중요한 것은 `'order/properties-order'` 으로 해당 속성에 지정한 값을 통해 속성을 그룹별로 나눠서 정렬할 수 있습니다.

그리고 Stylelint 익스텐션을 설치한 다음 vscode의 설정 파일에 아래와 같은 옵션을 추가해서 자동으로 규칙이 적용되도록 합니다.

```json
// .vscode/settings.json
{
  "stylelint.enable": true,
  "stylelint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

이렇게 설정을 하고나면 위에서 작성한 코드와 동일한 코드를 작성하더라도 rule에서 설정한 규칙에 따라 순서대로 정렬되는 것 뿐 아니라 각각의 그룹 별로 나누어져 있는 것을 확인할 수 있습니다.

```jsx
export const Box = styled.div`
  width: 200px;
  height: 200px;

  padding-left: 20px;
  padding-right: 20px;

  font-size: 12px;
  line-height: 20px;

  border-top: 1px solid black;
`
```

## 마치며

지금까지 어려 도구들을 사용해서 우리가 정한 컨벤션이 “잘” 적용되도록 하는 방법에 대해 알아보았습니다.

단순히 컨벤션을 정하는데 그친다면 문서나 사람에 의존하게 될 것입니다. 하지만 이를 자동화하고 강제할 수 있는 방법을 찾아 도입한다면 더 단단한 개발 환경을 만들 수 있습니다.
