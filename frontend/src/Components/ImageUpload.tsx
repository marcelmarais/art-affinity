import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Input, Box, Button, Text, ModalDialogContent } from "@artsy/palette";
import SearchIcon from "@artsy/icons/SearchIcon";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddStrokeIcon from "@artsy/icons/AddStrokeIcon";
import { useData } from '../Context/DataContext';
import InfoIcon from "@artsy/icons/InfoIcon";
import Modal from './Modal';
import ModalContent from './ModalContent';

interface Props {
  data: any;
  setData: (data: any) => void;
  inputText: string;   // <-- Added inputText
  setInputText: (value: string) => void;  // <-- Added setInputText
}
interface State {
  imageSelected: boolean;
  imageUrl: string | null;
  imageUploaded: boolean;
  isModalOpen: boolean;
  localInputValue: string;  // <-- Added local state for input value
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
      localInputValue: '',  // <-- Initialize local state for input value
    };
  }

  

  handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    this.selectedFile = file;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.setState({ imageSelected: true, imageUrl });
    } else {
      this.setState({ imageSelected: false, imageUrl: null });
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
  
      fetch(`${process.env.REACT_APP_BACKEND_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(responseData => {
        this.props.setData(responseData);  
        this.setState({ imageUploaded: true });
      })
      .catch(error => {
        alert(error);
        console.error(error);
      });
    }
  };

  handleButtonClick = () => {
    this.fileInputRef.current?.click();
  };
  
  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ localInputValue: e.target.value });  // <-- Update local state with typed value
  };

  handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log(this.state.localInputValue);
      this.props.setInputText(this.state.localInputValue);  // <-- Update shared state only on pressing Enter
    }
  };

  render() {
    const { imageUrl, imageUploaded, isModalOpen, localInputValue } = this.state;
    return (
      <Box display="flex" alignItems="center" flexDirection="center" style={{ maxWidth: "500px", width: "80%" }}>
        <input
          ref={this.fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={this.handleImageUpload}
          style={{ display: 'none' }}
        />
        
        {imageUrl ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border="1px solid #333"
            borderRadius="5px"
            mb={4}
            ml={4}
          >
            <img src={imageUrl} alt="Uploaded" style={{ width: '100%', objectFit: 'cover' }} />
            <Text variant="sm-display" color="black60" overflowEllipsis><i>You</i>, 2023</Text>
          </Box>
        ) : null}
  
        <Box  
          display="flex" 
          alignItems="center" 
          flexDirection="center"
          style={{ border: "1px solid black", borderRadius: "40px", padding: "5px", width: "100%"}} 
        >
        <Input 
        placeholder="Search for an artwork…"
        style={{ width: "80%",height: "40px", marginLeft: "10px", borderBottom: "none" }}
        value={localInputValue}  
        onChange={this.handleInputChange}
        onKeyPress={this.handleInputKeyPress}
        />

        <Box onClick={this.handleButtonClick}
            mr={1}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "20px" }}>
            <CameraAltIcon />
        </Box>            
        </Box>
        
      </Box>
    );
  }
}

const ImageUploadWithDataContext = () => {
  const { data, setData, inputText, setInputText } = useData();
  return <ImageUpload data={data} setData={setData} inputText={inputText} setInputText={setInputText} />;
};

export default ImageUploadWithDataContext;