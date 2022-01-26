import React, {useContext} from "react";
import styled from "styled-components";
import {colors} from "../layout/colors";
import {Link} from "react-router-dom";
import LoginContext from "../../login-context";

const LoginSectionContainer = styled.div`
  display: flex;
  align-items: center;
`

const LinkButton = styled(Link)`
  text-decoration: none;
  font-size: 14px;
  margin-left: 8px;
  color: white;
  background: ${colors.background.button};
  border: 2px solid ${colors.background.button};
  padding: 5px 7px;
  border-radius: 8px;

  &:hover {
    border-color: white;
  }
`

const LogOutButton = styled.button`
  text-decoration: none;
  font-size: 14px;
  margin-left: 8px;
  color: white;
  background: ${colors.font.votes.down};
  border: 2px solid ${colors.font.votes.down};
  padding: 5px 7px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: white;
  }
`

export const LoginSection = () => {
    const {setIsLoggedIn, isLoggedIn} = useContext(LoginContext)

    const handleLogOut = () => {
        //todo send logout to server
        setIsLoggedIn(false)
    }
    return (
        <LoginSectionContainer>
            {isLoggedIn ? <>
                    <LinkButton to='/account'>Account</LinkButton>
                    <LogOutButton onClick={handleLogOut}>Logout</LogOutButton>
                </> :
                <>
                    <LinkButton to='/login'>Login</LinkButton>
                    <LinkButton to='/sign-up'>Sign Up</LinkButton>
                </>}

        </LoginSectionContainer>
    )
}