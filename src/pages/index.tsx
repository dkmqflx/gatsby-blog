import React from 'react'
import { graphql } from 'gatsby'
import Introduction from 'components/Main/Introduction'
import { IndexPagePropsType } from 'types/main.type'

import Layout from 'components/Layout'

const index = ({
  data: {
    site: {
      siteMetadata: { author, introduction, social },
    },
    file: {
      childImageSharp: { gatsbyImageData },
    },
  },
}: IndexPagePropsType) => {
  return (
    <Layout>
      <Introduction
        profileImage={gatsbyImageData}
        author={author}
        introduction={introduction}
        social={social}
      />
    </Layout>
  )
}

export default index

export const getPostList = graphql`
  query getPostList {
    site {
      siteMetadata {
        title
        description
        siteUrl
        author
        introduction
        social {
          github
          linkedin
          twitter
          facebook
        }
      }
    }

    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
      publicURL
    }
  }
`
