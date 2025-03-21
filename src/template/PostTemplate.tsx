import React from 'react'
import { graphql } from 'gatsby'
import { PostTemplateProps } from 'types/post.types'
import Layout from 'components/Layout'
import Template from 'components/Common/Template'
import PostHead from 'components/Post/PostHead'
import PostContent from 'components/Post/PostContent'
import PostUtterance from 'components/Post/PostUtterance'

const PostTemplate = ({
  data: {
    site: {
      siteMetadata: { author },
    },
    allMarkdownRemark: { edges },
    file: { publicURL },
  },
  location: { href },
}: PostTemplateProps) => {
  const [
    {
      node: {
        html,
        frontmatter: { title, summary, date, categories },
      },
    },
  ] = edges

  return (
    <Layout>
      <Template
        title={title}
        description={summary}
        image={publicURL}
        url={href}
        author={author}
      >
        <PostHead title={title} date={date} categories={categories} />
        <PostContent html={html} />
        <PostUtterance />
      </Template>
    </Layout>
  )
}

export default PostTemplate

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    site {
      siteMetadata {
        author
      }
    }

    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            categories
            summary
          }
        }
      }
    }

    file(name: { eq: "profile-image" }) {
      publicURL
    }
  }
`
