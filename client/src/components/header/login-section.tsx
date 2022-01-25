import React, {useState} from "react";
import styled from "styled-components";
import {colors} from "../layout/colors";
import {Link} from "react-router-dom";

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
  padding: 6px 8px;
  border-radius: 8px;

  &:hover{
    opacity: 90%;
  }
`

export const LoginSection = () => {

    return (
        <LoginSectionContainer>
            <LinkButton to='/login'>Login</LinkButton>
            <LinkButton to='/sign-up'>Sign Up</LinkButton>
        </LoginSectionContainer>
    )
}