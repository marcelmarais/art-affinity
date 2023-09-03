import React, { FC } from 'react';
import { Box, CSSGrid, Spacer } from "@artsy/palette"
import ArtCard, { ArtCardProps } from './ArtCard';
import styled from 'styled-components';

const ResponsiveGrid = styled(CSSGrid)`
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  }
`;

interface ResultsViewProps {
  results: ArtCardProps[];
}

const ResultsView: FC<ResultsViewProps> = ({ results }) => {
  return (
    <Box p={2}>
      <ResponsiveGrid
        alignItems="center"
        justifyItems="center"
        gridGap={30}
      >
        {results.map((result, index) => (
          <a 
          href={result.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }} 
          key={index}
        >          
          <Box width = {230} key={index}>
            <ArtCard {...result} />
          </Box>
          </a>
        ))}
      </ResponsiveGrid>
    </Box>
  );
};

export default ResultsView;
