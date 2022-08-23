import React from 'react'
import { graphql } from 'gatsby'
import { PostTemplateProps } from 'types/post.types'
import Template from 'components/Common/Template'
import PostHead from 'components/Post/PostHead'
import PostContent from 'components/Post/PostContent'
import Layout from 'components/Layout'

const PostTemplate = ({
  data: {
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
      >
        <PostHead title={title} date={date} categories={categories} />
        <PostContent html={html} />
      </Template>
    </Layout>
  )
}

export default PostTemplate

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
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
      publicURL
    }
  }
`
