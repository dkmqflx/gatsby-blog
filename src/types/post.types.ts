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
