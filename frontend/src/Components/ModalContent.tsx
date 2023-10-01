import React, { FC } from "react";
import {
  Box,
  Text,
  EntityHeader,
  EntityHeaderProps,
  Image,
} from "@artsy/palette";
import styled from "styled-components";

interface Props {}

const StyledA = styled.a`
  color: #000; // or any other color you prefer
`;

const ModalContent: FC<Props> = (props) => {
  return (
    <Box>
      <EntityHeader
        initials="MM"
        name="Marcel Marais"
        image={{
          src: "https://marcelmarais.github.io/assets/images/marcel-marais.jpeg",
        }}
        meta="Machine Learning Engineer & Data Scientist"
        href="https://marcelmarais.github.io/"
        maxWidth={350}
      />

      <Text variant="sm" color="black100" fontWeight="bold" mt={2}>
        What is ArtAffinity?
      </Text>
      <Text variant="sm" mb={1} mt={1}>
        Art Affinity is an AI first search engine that empowers you to find new works based
        on the actual content of the piece rather than key words or meta tags. This means
        you can search using natural language, including emotions, styles and historical artists. Try: <i>"feelings of inner turmoil"</i>.
      </Text>
      <Text variant="sm" color="black100" fontWeight="bold" mt={1}>
        How can I find out more?
      </Text>
      <Text variant="sm" mb={1}>
        I am currently writing more about how I built this and the problem I think it solves.
        If you have any questions in the interim, or want to see your gallery
        added feel free to{" "}
        <StyledA
          href="https://www.linkedin.com/in/marcel-marais-599095175/"
          rel="noreferrer"
          target="_blank"
        >
          contact me on Linkedin.
        </StyledA>
      </Text>
    </Box>
  );
};

export default ModalContent;
