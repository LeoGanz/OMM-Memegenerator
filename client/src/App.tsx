import React, {useState} from 'react';
import {GlobalStyle} from "./global-style";
import {Header} from "./components/header/header";
import styled from "styled-components";
import {up} from "./util/breakpoint";
import LoginContext from './login-context';


const Main = styled.main`
  margin: 0 15px;
  padding-bottom: 100px;

  ${up('md')} {
    margin: 0 100px;
  }

`
//todo add type
function App({children}: any) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const value = { isLoggedIn, setIsLoggedIn };

    return (
        <LoginContext.Provider value={value}>
            <GlobalStyle/>
            <Header/>
            <Main>
                {children}
            </Main>
        </LoginContext.Provider>
    );
}

export default App;
