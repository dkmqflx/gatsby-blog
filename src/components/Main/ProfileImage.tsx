import React from 'react'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import styled from '@emotion/styled'

const ProfileImageWrapper = styled(GatsbyImage)`
  width: 6.375rem;
  height: 6.375rem;
  min-width: 6.375rem;
  min-height: 6.375rem;

  border-radius: 50%;
  margin-right: 1.75em;

  & img {
    border-radius: 50%;
  }

  @media (max-width: 23.438rem) {
    width: 5rem;
    height: 5rem;
    min-width: 5rem;
    min-height: 5rem;

    margin-right: 1.125em;
  }
`

const ProfileImage = ({ profileImage }: { profileImage: IGatsbyImageData }) => {
  return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage
