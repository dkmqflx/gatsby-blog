import { graphql } from 'gatsby'
import queryString, { ParsedQuery } from 'query-string'
import { IndexPagePropsType } from 'types/main.types'
import Layout from 'components/Layout'
import Introduction from 'components/Main/Introduction'
import CategoryList from 'components/Main/CategoryList'
import Template from 'components/Common/Template'
import PostList from 'components/Main/PostList'

const index = ({
  location: { search },
  data: {
    site: {
      siteMetadata: {
        title,
        description,
        siteUrl,
        author,
        introduction,
        social,
      },
    },
    allMarkdownRemark: { edges },
    file: {
      childImageSharp: { gatsbyImageData },
      publicURL,
    },
  },
}: IndexPagePropsType) => {
  const parsed: ParsedQuery<string> = queryString.parse(search)

  const selectedCategory: string =
    typeof parsed.category !== 'string' || !parsed.category
      ? 'All'
      : parsed.category

  return (
    <Layout>
      <Introduction
        profileImage={gatsbyImageData}
        introduction={introduction}
        social={social}
      />

      <CategoryList selectedCategory={selectedCategory} posts={edges} />

      <Template
        title={title}
        description={description}
        url={siteUrl}
        image={publicURL}
        author={author}
      >
        <PostList selectedCategory={selectedCategory} posts={edges} />
      </Template>
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

    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            categories
          }
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
