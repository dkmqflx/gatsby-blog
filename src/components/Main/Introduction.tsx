import React from 'react'
import { Link } from 'gatsby'
import ProfileImage from 'components/Main/ProfileImage'
import { IntroductionProps } from 'types/main.types'
import styled from '@emotion/styled'
import Github from '/static/github.svg'
import LinkedIn from '/static/linkedin.svg'
import Twitter from '/static/twitter.svg'
import Facebook from '/static/facebook.svg'

const socialIcons: { [index: string]: JSX.Element } = {
  github: <Github />,
  linkedin: <LinkedIn />,
  twitter: <Twitter />,
  facebook: <Facebook />,
}

const Introduction = ({
  profileImage,
  introduction,
  social,
}: IntroductionProps) => {
  return (
    <Wrapper>
      <Profile>
        <ProfileImage profileImage={profileImage} />

        <div>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  word-break: break-word;
  margin-bottom: 2.5em;
`

const Profile = styled.div`
  display: flex;
  align-items: center;
`

const IntroductionWrapper = styled.div`
  margin-bottom: 1.625em;

  @media (max-width: 48rem) {
    margin-bottom: 1.2em;
  }
`
const SocalLink = styled(Link)`
  &:not(:first-of-type) {
    margin-left: 0.625em;

    @media (max-width: 48rem) {
      margin-left: 0.4em;
    }
  }
`
