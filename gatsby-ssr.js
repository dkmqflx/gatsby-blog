export const onRenderBody = ({ setPreBodyComponents }) =>
  setPreBodyComponents([
    <head key="google">
      <meta
        name="google-site-verification"
        content="ZMqhg3FRmL_SyoEv-hk5Bepv1SImbOwbqDi5fC05mM4"
      />
    </head>,
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
