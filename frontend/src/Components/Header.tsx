import React, { useState } from 'react';
import styled from 'styled-components';
import { ModalDialogContent, Separator, Spacer, Text, Button } from "@artsy/palette";
import ArtsyLogoIcon from "@artsy/icons/ArtsyLogoIcon";
import Modal from './Modal';
import ModalContent from './ModalContent';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

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
        <Button onClick={handleModalToggle}>About</Button>
      </div>
      <Separator borderWidth={1} my={1} as="hr" width="100%" color="black10" />
      {isModalOpen && (
        <Modal>
          <div>
            <ModalDialogContent onClose={handleModalToggle}>
            <ModalContent/>
            </ModalDialogContent>
          </div>
        </Modal>
      )}
    </HeaderContainer>
  );
};

export default Header;
