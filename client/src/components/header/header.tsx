import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {HeaderTitle} from "../layout/typography";
import GitHubIcon from "../../assets/icons/GitHub-Mark-Light-64px.png"

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
  padding: 0 100px;
`

const StyledHeaderTitle = styled(HeaderTitle)`
  color: ${colors.font.white};
`

const GitHubLink = styled.a`
  display: flex;
  cursor: pointer;
  transition: opacity .2s;
  &:hover {
    opacity: 70%;
  }
`

const GitHubImg = styled.img`
  width: 32px;
`

export const Header = () =>  {
    return (
        <StyledHeader>
            <StyledHeaderTitle>Meme Generator - Group 7</StyledHeaderTitle>
            <GitHubLink target="_blank" rel="noopener noreferrer" href="https://github.com/Adam-Phil/OMM_Project"><GitHubImg src={GitHubIcon} alt=""/></GitHubLink>
        </StyledHeader>
);
}

