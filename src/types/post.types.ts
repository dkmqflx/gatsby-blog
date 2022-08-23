export type PostFrontmatterType = {
  title: string
  date: string
  categories: string[]
  summary: string
}

export type PostListItemType = {
  node: {
    id: string
    fields: {
      slug: string
      readingTime: { text: string }
    }
    frontmatter: PostFrontmatterType
  }
}

export type PostPageItemType = {
  node: {
    html: string
    frontmatter: PostFrontmatterType
  }
}

export type PostTemplateProps = {
  data: {
    site: {
      siteMetadata: {
        author: string
      }
    }

    allMarkdownRemark: {
      edges: PostPageItemType[]
    }
    file: {
      publicURL: string
    }
  }
  location: {
    href: string
  }
}

export type PostHeadProps = {
  title: string
  date: string
  categories: string[]
}
