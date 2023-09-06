import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import ResultsView from './Components/ResultsView';
import ImageUploadWithDataContext from './Components/ImageUpload';
import { ArtCardProps } from './Components/ArtCard';
import { Input, Separator, Box, Spacer } from "@artsy/palette"
import { useData } from './Context/DataContext';

const image_url = "https://d7hftxdivxxvm.cloudfront.net?height=489&quality=80&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fp8-dS_m_hQzxy0rFkVqJKg%2Flarger.jpg&width=445"
const Search: FC = () => {
  const [results, setResults] = useState<ArtCardProps[]>([
    // {
    //   title: "Name", 
    //   artistName: "Artist Name", 
    //   img_src: image_url, 
    //   date: "Date", 
    //   galleryName: "Gallery Name"
    // },
    // {
    //   title: "Name", 
    //   artistName: "Artist Name", 
    //   img_src: image_url, 
    //   date: "Date", 
    //   galleryName: "Gallery Name"
    // }
  ]);
  
  const { data, setData, inputText } = useData();

  const processApiResponse = (response: any) => {
    const metadatas = response.metadatas[0];
    const distances = response.distances[0];
    
    // Combine metadatas and distances
    const combined = metadatas.map((metadata: any, index: number) => {
      return {
        ...metadata,
        distance: distances[index]
      }
    });
  
    // Sort combined array based on distance
    const sorted = combined.sort((a: any, b: any) => a.distance - b.distance);
  
    const mappedResults = sorted.map((item: any) => {
      return {
        galleryName: item['Gallery Name'],
        title: item.Name,
        artistName: item.Artist,
        img_src: item['Image URL'],
        date: 'Test date',
        price: item.Price,
        url: item.Href
      }
    });
  
    return mappedResults;
  };
  

  useEffect(() => {
    if (data) {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/query`, {
        query_texts: [data.filename],
      })
      .then(response => {
        const mappedResults = processApiResponse(response.data);
        setResults(mappedResults);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [data]);
  
  useEffect(() => {
    if (inputText) {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/text-query`, {
        query_text: inputText,
      })
      .then(response => {
        const mappedResults = processApiResponse(response.data);
        setResults(mappedResults);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [inputText]);
  
  
  return (
    <div>
      <Box style={{width:"100%"}} display="flex" justifyContent="center" alignItems="center">
        <ImageUploadWithDataContext />
      </Box>

      <Spacer y={30} />
      <ResultsView results={results} />
    </div>
  );
};

export default Search;
