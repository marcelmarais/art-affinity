import { Box, Flex, Join, SkeletonText, Spacer, Text } from "@artsy/palette"
// import { themeGet } from "@styled-system/theme-get"
import styled from "styled-components"
import React, { FC, ReactNode } from 'react';

interface DetailsProps {
  artistName: string
  galleryName: string
  title: string
  date: string
  price: string
  url: string
}

const SaleInfoLine: React.FC<DetailsProps>  = ({
  price
}) => {
  return (
    <Text variant="xs" color="black100" fontWeight="bold" overflowEllipsis>
      {price}
    </Text>
  )
}

const TitleLine: React.FC<DetailsProps> = ({
  title,
  date
}) => {
  return (
      <Text variant="sm-display" color="black60" overflowEllipsis>
        <i>{title}</i>
        {date && `, ${date}`}
      </Text>
  )
}

const PartnerLine: React.FC<DetailsProps> = ({
  galleryName
}) => {
  if (galleryName) {
    return (
      <Text variant="xs" color="black60" overflowEllipsis>
        {galleryName}
      </Text>
    )
  }
  return null
}

const ArtistLine: React.FC<DetailsProps> = ({
  artistName,

}) => {
  return (
    <Text variant="sm-display" overflowEllipsis>
        <span className="link">{artistName}</span>
    </Text>
  )
}


  export const Details: React.FC<DetailsProps> = ({
    ...rest
  }) => {
  
    
    const StyledArtistLine = styled(ArtistLine)`

      .link {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
      `
    return (

      <Box>
        <Flex flexDirection="row" justifyContent="space-between">
            <StyledArtistLine {...rest} />
        </Flex>
        <Box position="relative">
        <TitleLine {...rest} />
         <PartnerLine {...rest} /> 
         <SaleInfoLine {...rest} /> 
        </Box>
      </Box>
    )
  }
  