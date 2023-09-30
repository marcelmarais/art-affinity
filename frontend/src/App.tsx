// App.js
import React from "react";
import Search from "./ResultsView";
import Header from "./Components/Header";
import { Theme } from "@artsy/palette";
import { DataProvider } from "./Context/DataContext";
import styled from "styled-components";

const MainContainer = styled.div`
  overflow-y: auto;
  height: 100vh; // or any other height that fits your design
`;

const App: React.FC = () => {
  return (
    <MainContainer>
      <DataProvider>
        <Theme>
          <Header />
          <Search />
        </Theme>
      </DataProvider>
    </MainContainer>
  );
};

export default App;
