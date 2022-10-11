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

import { RecoilRoot } from 'recoil'

export const wrapRootElement = ({ element }) => {
  return <RecoilRoot>{element}</RecoilRoot>
}
