import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  inputText: string; // <-- Added inputText
  setInputText: React.Dispatch<React.SetStateAction<string>>; // <-- Added setInputText
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [inputText, setInputText] = useState<string>(''); // <-- Added state for inputText

  return (
    <DataContext.Provider value={{ data, setData, inputText, setInputText }}> 
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
