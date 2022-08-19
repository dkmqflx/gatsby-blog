import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'

import styled from '@emotion/styled'

const ProfileImage = styled(GatsbyImage)`
  width: 72px;
  height: 72px;
  min-width: 72px;
  min-height: 72px;
  border-radius: 50%;
  margin-right: 20px;
`

type IndexPageProps = {
  data: {
    allMarkdownRemark: {
      edges: [
        {
          node: {
            id: string
            frontmatter: {
              title: string
              summary: string
              date: string
              categories: string[]
            }
          }
        },
      ]
    }
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
      publicURL: string
    }
  }
}

function index({
  data: {
    allMarkdownRemark: {
      edges: [
        {
          node: {
            frontmatter: { title, summary, date, categories },
          },
        },
      ],
    },
    file: {
      childImageSharp: { gatsbyImageData },
      publicURL,
    },
  },
}: IndexPageProps) {
  console.log(publicURL)
  return (
    <>
      <div>{`${title}, ${summary}, ${date}, ${categories}`}</div>

      <ProfileImage image={gatsbyImageData} alt="Profile Image" />
    </>
  )
}

export default index

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
          }
        }
      }
    }

    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`
