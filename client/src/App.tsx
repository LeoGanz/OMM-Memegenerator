import React from 'react';
import {GlobalStyle} from "./global-style";
import {Header} from "./components/header/header";
import styled from "styled-components";
import {up} from "./util/breakpoint";


const Main = styled.main`
  margin: 0 15px;
  padding-bottom: 100px;

  ${up('md')} {
    margin: 0 100px;
  }

`
//todo add type
function App({children}: any) {
    return (
        <>
            <GlobalStyle/>
            <Header/>
            <Main>
                {children}
            </Main>
        </>
    );
}

export default App;
