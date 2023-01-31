import { IGatsbyImageData } from 'gatsby-plugin-image'
import { PostListItemType } from './post.types'

export type IndexPagePropsType = {
  location: {
    search: string
  }

  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
        siteUrl: string
        author: string
        introduction: string
        social: {
          github: string
          linkedin: string
          twitter: string
          facebook: string
        }
      }
    }

    allMarkdownRemark: {
      edges: PostListItemType[]
    }

    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
      publicURL: string
    }
  }
}

export type IntroductionProps = {
  profileImage: IGatsbyImageData
  introduction: string
  social: {
    github: string
    linkedin: string
    twitter: string
    facebook: string
  }
}

export type CategoryListProps = {
  selectedCategory: string
  posts: PostListItemType[]
}

export type categoryListType = {
  [key: string]: number
}
