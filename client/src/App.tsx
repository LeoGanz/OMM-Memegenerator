import React, {useEffect, useState} from 'react';
import {GlobalStyle} from "./global-style";
import {Header} from "./components/header/header";
import styled from "styled-components";
import {up} from "./util/breakpoint";
import LoginContext from './login-context';
import {getJwt} from "./util/jwt";
import {useNavigate} from "react-router-dom";


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
    let navigate = useNavigate()

    useEffect(()=>{
        fetch('http://localhost:3000/verify' + getJwt(), {
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    return response.text()
                }
                return response.text().then(response => {throw new Error(response)})
            })
            .then((response) => {
                if(response === 'true'){
                    setIsLoggedIn(true)
                }else{
                    navigate('/login')
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [])

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
