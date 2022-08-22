import { IGatsbyImageData } from 'gatsby-plugin-image'

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
  author: string
  introduction: string
  social: {
    github: string
    linkedin: string
    twitter: string
    facebook: string
  }
}
