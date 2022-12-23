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
`

const ProfileImage = ({ profileImage }: { profileImage: IGatsbyImageData }) => {
  return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage
