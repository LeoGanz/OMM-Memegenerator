import React from 'react';
import {GlobalStyle} from "./global-style";
import {Header} from "./components/header/header";
import styled from "styled-components";
import {Overview} from "./pages/overview";

const Main = styled.main`
  margin: 0 100px;
`
function App() {
    return (
        <>
            <GlobalStyle/>
            <Header/>
            <Main>
                <Overview/>
            </Main>
        </>
    );
}

export default App;
