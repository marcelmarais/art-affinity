// App.js
import React from 'react';
import Search from './Search';
import Header from './Components/Header';
import { Theme, injectGlobalStyles } from "@artsy/palette"
import { DataProvider } from './Context/DataContext';

const { GlobalStyles } = injectGlobalStyles(`
  // overrides and additions
`);

const App: React.FC = () => {
  return (
    <DataProvider>
      <Theme>
        <Header />
        <Search />
      </Theme>
  </DataProvider>
    
  );
}

export default App;
