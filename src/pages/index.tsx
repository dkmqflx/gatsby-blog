import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import queryString, { ParsedQuery } from 'query-string'
import { IndexPagePropsType, CategoryListProps } from 'types/main.types'
import { PostListItemType } from 'types/post.types'
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

  const categoryList = useMemo(
    () =>
      edges.reduce(
        (
          list: CategoryListProps['categoryList'],
          {
            node: {
              frontmatter: { categories },
            },
          }: PostListItemType,
        ) => {
          categories.forEach(category => {
            if (list[category] === undefined) list[category] = 1
            else list[category]++
          })

          list['All']++

          return list
        },
        { All: 0 },
      ),
    [],
  )

  return (
    <Layout>
      <Introduction
        profileImage={gatsbyImageData}
        introduction={introduction}
        social={social}
      />

      <CategoryList
        selectedCategory={selectedCategory}
        categoryList={categoryList}
      />

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
            summary
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
