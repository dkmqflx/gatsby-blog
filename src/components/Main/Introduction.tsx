import React from 'react'
import { Link } from 'gatsby'
import ProfileImage from 'components/Main/ProfileImage'
import { IntroductionProps } from 'types/main.type'
import styled from '@emotion/styled'
import Github from '/static/github.svg'
import LinkedIn from '/static/linkedin.svg'
import Twitter from '/static/twitter.svg'
import Facebook from '/static/facebook.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  word-break: break-word;
  margin: 20px 0;
`

const Author = styled.div`
  font-weight: bold;
`

const Profile = styled.div`
  display: flex;
  align-items: center;
`

const IntroductionWrapper = styled.div`
  margin: 4px 0 10px 0;
`
const SocalLink = styled(Link)`
  &:not(:first-of-type) {
    margin-left: 8px;
  }
`

const socialIcons: { [index: string]: JSX.Element } = {
  github: <Github />,
  linkedin: <LinkedIn />,
  twitter: <Twitter />,
  facebook: <Facebook />,
}

const Introduction = ({
  profileImage,
  author,
  introduction,
  social,
}: IntroductionProps) => {
  return (
    <Wrapper>
      <Profile>
        <ProfileImage profileImage={profileImage} />

        <div>
          <Author>Written by {author}</Author>
          <IntroductionWrapper>{introduction}</IntroductionWrapper>
          {Object.entries(social).map(
            ([key, value]) =>
              value && (
                <SocalLink key={key} to={value}>
                  {socialIcons[key]}
                </SocalLink>
              ),
          )}
        </div>
      </Profile>
    </Wrapper>
  )
}

export default Introduction
