import React, { ChangeEvent, useState } from 'react';
import { Box, Button, Text, ModalDialogContent} from "@artsy/palette";
import SearchIcon from "@artsy/icons/SearchIcon";
import AddStrokeIcon from "@artsy/icons/AddStrokeIcon";
import { useData } from '../Context/DataContext';
import InfoIcon from "@artsy/icons/InfoIcon";
import Modal from './Modal';
import ModalContent from './ModalContent';

interface Props {
  data: any;
  setData: (data: any) => void;
}

interface State {
  imageSelected: boolean;
  imageUrl: string | null;
  imageUploaded: boolean;
  isModalOpen: boolean;
}

class ImageUpload extends React.Component<Props, State> {
  fileInputRef = React.createRef<HTMLInputElement>();
  selectedFile: File | null = null;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      imageSelected: false,
      imageUrl: null,
      imageUploaded: false,
      isModalOpen: false,
    };
  }
  

  handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    console.log(file);
    this.selectedFile = file;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.setState({ imageSelected: true, imageUrl });
    } else {
      this.setState({ imageSelected: false, imageUrl: null });
    }
  };

  handleButtonClick = () => {
    this.fileInputRef.current?.click();
  };

  handleUploadButtonClick = () => {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
  
      fetch('http://192.168.0.22:8000/upload-image', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(responseData => {
        this.props.setData(responseData);  // <-- set the data
        this.setState({ imageUploaded: true });  // <-- new state to track if the image is uploaded
        // Handle the response from your server
      })
      .catch(error => {
        console.error(error);
        // Handle the error
      });
    }
  };
  
  

  render() {
    
    const { imageUrl, imageUploaded, isModalOpen } = this.state;
    return (
      <Box display="flex" alignItems="center" flexDirection="center">
        <input
          ref={this.fileInputRef}
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          capture={true}
          onChange={this.handleImageUpload}
        />
        
        {imageUrl ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={110}

            border="1px solid #333"
            borderRadius="5px"
            mb={4}
            ml={4}
          >
            <img src={imageUrl} alt="Uploaded" style={{ width: '100%', objectFit: 'cover' }} />
            <Text variant="sm-display" color="black60" overflowEllipsis><i>You</i>, 2023</Text>
          </Box>
        ) : null}
  
        <Button 
          variant="primaryBlack"
          Icon={AddStrokeIcon}
          onClick={this.handleButtonClick}
          success={this.state.imageSelected}
          ml={"20px"}
        >
            {this.state.imageSelected ? 'Success' : 'Take a photo'}
            
        </Button>
        <Button 
          variant="secondaryBlack" 
          size="small" 
          height="40px" 
          Icon={InfoIcon} 
          onClick={() => this.setState({ isModalOpen: true })}
        />

        {this.state.imageSelected && (
          <Button 
            Icon={SearchIcon}
            variant="primaryBlack"
            onClick={this.handleUploadButtonClick}
          >
          </Button>
        )}
          {imageUploaded ? (
        <Button 
          variant="primaryBlack"
          onClick={() => this.setState({ imageSelected: false, imageUrl: null, imageUploaded: false })}
        >
          Upload another image
        </Button>
      ) : null}

      {isModalOpen && (
        <Modal>
          <ModalDialogContent  title="About" onClose={() => this.setState({ isModalOpen: false })}  maxHeight={400}>
            <ModalContent />
          </ModalDialogContent>
        </Modal>
      )}
      </Box>
    );
  }
}

const ImageUploadWithDataContext = () => {
  const { data, setData } = useData();

  return <ImageUpload data={data} setData={setData} />;
};

export default ImageUploadWithDataContext;
