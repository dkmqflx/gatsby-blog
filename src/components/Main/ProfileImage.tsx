import React from 'react'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import styled from '@emotion/styled'

const ProfileImageWrapper = styled(GatsbyImage)`
  width: 4.5rem;
  height: 4.5rem;
  min-width: 4.5rem;
  min-height: 4.5rem;
  border-radius: 50%;
  margin-right: 1.25em;
  & img {
    border-radius: 50%;
  }
`

const ProfileImage = ({ profileImage }: { profileImage: IGatsbyImageData }) => {
  return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage
