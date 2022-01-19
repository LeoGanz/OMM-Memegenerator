import React, {useState} from 'react';
import {GlobalStyle} from "./global-style";
import {Header} from "./components/header/header";
import styled from "styled-components";
import {Overview} from "./pages/overview";
import {MemeDetails} from "./pages/meme-details";
import {up} from "./util/breakpoint";

const Main = styled.main`
  margin: 0 15px;
  padding-bottom: 100px;

  ${up('md')} {
    margin: 0 100px;
  }

`

function App() {
    //only a temporary solution to show the functionality -> Later every Meme gets its own MemeDetail Page with an unique path
    const [currentPage, setCurrentPage] = useState<("Overview" | "Details")>("Overview")

    return (
        <>
            <GlobalStyle/>
            <Header/>
            <Main>
                {currentPage === "Overview" && <Overview clickPicture={() => {
                    setCurrentPage("Details")
                }}/>}
                {currentPage === "Details" && <MemeDetails/>}
            </Main>
        </>
    );
}

export default App;
