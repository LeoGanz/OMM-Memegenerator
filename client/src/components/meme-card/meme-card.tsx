import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {up} from "../../util/breakpoint";
import {MemeInfos} from "../meme-infos/meme-infos";

const StyledMemeCard = styled.div`
  background-color: ${colors.background.memeCard.default};
  border: 1px solid ${colors.background.memeCard.default};
  border-radius: 4px;
  padding: 10px;
  grid-column-start: span 12;
  cursor: pointer;
  transition: background-color .2s;

  ${up('sm')} {
    grid-column-start: span 6;
  }

  ${up('md')} {
    grid-column-start: span 4;
  }

  ${up('lg')} {
    grid-column-start: span 3;
  }

  &:hover {
    background-color: ${colors.background.memeCard.hover};
  }
`

const MemePreview = styled.img`
  width: 100%;
`


export interface MemeCardType {
    memePath: string;
    author: string;
    formattedDate: string;
    amountOfComments: number;
    upVotes: number;
    downVotes: number;
    onClick: () => any;
}


export const MemeCard = ({memePath, onClick, ...props}: MemeCardType) => {
    return (
        <StyledMemeCard onClick={() => onClick()}>
            <MemePreview src={memePath}/>
            <MemeInfos {...props}/>
        </StyledMemeCard>

    );
}