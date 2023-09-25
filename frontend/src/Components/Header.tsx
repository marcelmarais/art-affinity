import React, { useState } from 'react';
import styled from 'styled-components';
import { ModalDialogContent, Flex, CSSGrid, Separator, Spacer, Text, Button } from "@artsy/palette";
import ArtsyLogoIcon from "@artsy/icons/ArtsyLogoIcon";
import InfoIcon from "@artsy/icons/InfoIcon";
import Modal from './Modal';
const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 1000;
  .textWrapper {
    padding: 10px 20px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }
`;


const Header: React.FC = () => {

  return (
    <HeaderContainer>
      <div className="textWrapper">
        <div>
          <Text variant="xl">ArtAffinity</Text>
          <Spacer y={0.1} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text variant="s" style={{ marginRight: '-15px' }}>Powered by</Text>
            <ArtsyLogoIcon height="25px" />
          </div>
        </div>
      </div>
      <Separator borderWidth={1} my={1} as="hr" width="100%" color="black10" />

    
    </HeaderContainer>
  );
};

export default Header;
