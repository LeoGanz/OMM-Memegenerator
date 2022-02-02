import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {up} from "../../util/breakpoint";
import {LoginSection} from "./login-section";
import {Link} from "react-router-dom";

const HEADER_HEIGHT = '50px';

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  background: ${colors.background.header};
  height: ${HEADER_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  color: ${colors.font.white};
  font-size: 20px;
  z-index: 1000;

  ${up('md')} {
    padding: 0 100px;
    font-size: 24px;
  }
`

const StyledHeaderTitle = styled(Link)`
  color: ${colors.font.white};
  cursor: pointer;
  text-decoration: none;
`


export const Header = () => {
    return (
        <StyledHeader>
            <StyledHeaderTitle to="/">Meme Generator - Group 7</StyledHeaderTitle>
            <LoginSection />
        </StyledHeader>
    );
}

