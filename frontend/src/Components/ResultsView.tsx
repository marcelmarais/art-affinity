import React, { FC } from "react";
import { Box, CSSGrid, Spacer } from "@artsy/palette";
import ArtCard, { ArtCardProps } from "./ArtCard";
import styled, { keyframes } from "styled-components";

const ResponsiveGrid = styled(CSSGrid)`
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedLink = styled.a<{ delay: number }>`
  text-decoration: none;
  color: inherit;
  opacity: 0;
  animation: ${fadeIn} 0.3s ${(props) => props.delay}s forwards;
`;
interface ResultsViewProps {
  results: ArtCardProps[];
}

const ResultsView: FC<ResultsViewProps> = ({ results }) => {
  return (
    <Box p={2}>
      <ResponsiveGrid alignItems="center" justifyItems="center" gridGap={30}>
        {results.map((result, index) => (
          <AnimatedLink
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            delay={index * 0.2}
            key={index}
          >
            <Box width={230} key={index}>
              <ArtCard {...result} />
            </Box>
          </AnimatedLink>
        ))}
      </ResponsiveGrid>
    </Box>
  );
};

export default ResultsView;
