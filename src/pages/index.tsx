import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import queryString, { ParsedQuery } from 'query-string'

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
  location: { search: string }
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
  location: { search },
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
    },
  },
}: IndexPageProps) {
  const parsed: ParsedQuery<string> = queryString.parse(search)
  const selectedCategory: string =
    typeof parsed.category !== 'string' || !parsed.category
      ? 'All'
      : parsed.category

  console.log(parsed, selectedCategory)
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
