import React from 'react'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import styled from '@emotion/styled'

const ProfileImageWrapper = styled(GatsbyImage)`
  width: 72px;
  height: 72px;
  min-width: 72px;
  min-height: 72px;
  border-radius: 50%;
  margin-right: 20px;
`

const ProfileImage = ({ profileImage }: { profileImage: IGatsbyImageData }) => {
  return <ProfileImageWrapper image={profileImage} alt="Profile Image" />
}

export default ProfileImage
