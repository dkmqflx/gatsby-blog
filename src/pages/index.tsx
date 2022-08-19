import React from 'react'
import { graphql } from 'gatsby'

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
  },
}: IndexPageProps) {
  return <div>{`${title}, ${summary}, ${date}, ${categories}`}</div>
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
  }
`
