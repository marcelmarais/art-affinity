import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import ResultsView from './Components/ResultsView';
import ImageUploadWithDataContext from './Components/ImageUpload';
import { ArtCardProps } from './Components/ArtCard';
import { Box, Spacer, Spinner } from "@artsy/palette"
import { useData } from './Context/DataContext';
import { Title } from '@mui/icons-material';

const image_url = "https://d7hftxdivxxvm.cloudfront.net?height=489&quality=80&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fp8-dS_m_hQzxy0rFkVqJKg%2Flarger.jpg&width=445"
const Search: FC = () => {
  const [results, setResults] = useState<ArtCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data, setData, inputText } = useData();

  const processApiResponse = (response: any) => {
    const metadatas = response.metadatas[0];
    const distances = response.distances[0];
    

    const combined = metadatas.map((metadata: any, index: number) => {
      return {
        ...metadata,
        distance: distances[index]
      }
    });
  
    // Sort combined array based on distance
    const sorted = combined.sort((a: any, b: any) => a.distance - b.distance);
  
    const mappedResults = sorted.map((item: any) => {
      const [title, date] = (item.Name || '').split(','); 
      
      return {
        galleryName: item['Gallery Name'],
        title: title,
        artistName: item.Artist,
        img_src: item['Image URL'],
        date: date,
        price: item.Price,
        url: item.Href
      }
    });
  
    return mappedResults;
  };
  

  useEffect(() => {
    if (data) {
      setIsLoading(true); 
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/query`, {
        query_texts: [data.filename],
      })
      .then(response => {
        const mappedResults = processApiResponse(response.data);
        setResults(mappedResults);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false); 
      });
    }
  }, [data]);
  
  useEffect(() => {
    if (inputText) {
      setIsLoading(true); 
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/text-query`, {
        query_text: inputText,
      })
      .then(response => {
        const mappedResults = processApiResponse(response.data);
        setResults(mappedResults);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false); 
      });
    }
  }, [inputText]);
  
  
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Box style={{ width: "100%" }} display="flex" justifyContent="center" alignItems="center">
        <ImageUploadWithDataContext />
      </Box>
  
      <Spacer y={30} />
  
      {isLoading ?
        <Box style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          zIndex: 10
        }}>
          <Spinner position="static" delay={0} size="large" color="brand" />
        </Box>
        :
        <ResultsView results={results} />}
    </div>
  );
  
  
};

export default Search;