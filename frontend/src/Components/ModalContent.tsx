import React, { FC } from 'react';
import { Box, Text, EntityHeader, EntityHeaderProps, Image } from "@artsy/palette";
import styled from "styled-components"

interface Props {
}

const StyledA = styled.a`
  color: #000; // or any other color you prefer
`;

const ModalContent: FC<Props> = (props) => {
  return (
    <Box>
    <EntityHeader
      initials="MM"
      name="Marcel Marais"
      image={{src: "https://marcelmarais.github.io/assets/images/marcel-marais.jpeg"}}
      meta="Machine Learning Engineer & Data Scientist"
      href="https://marcelmarais.github.io/"
      maxWidth={350}
    />
    
    <Text variant="sm" color="black100" fontWeight="bold" mt={2}>
      What is ArtAffinity?
    </Text>
     <Text variant="sm" mb={1} mt={1}>
        ArtAffinity is an AI tool that allows you to find new art that is similar to pieces you already like. 
        Simply upload an image of a piece of art you like, press the search icon, and ArtAffinity will find new pieces for you.
     </Text>
     <Text variant="sm" color="black100" fontWeight="bold" mt={1}>
      How can I find out more?
    </Text>
     <Text variant="sm" mb={1}>
        You can read about the technical details of ArtAffinity in the <StyledA href="https://medium.com" rel="noreferrer" target='_blank'>article</StyledA> I wrote about it.
        If you have any questions, or want to see your gallery added feel free to <StyledA href="https://marcelmarais.github.io/contact" rel="noreferrer" target='_blank'>contact me</StyledA>.
     </Text>
    </Box>
  );
}

export default ModalContent;
