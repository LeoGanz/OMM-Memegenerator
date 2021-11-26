import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {MetaData} from "../layout/typography";

const StyledMemeCard = styled.div`
  background-color: ${colors.background.memeCard.default};
  padding: 10px;
  grid-column-start: span 3;
  cursor: pointer;
  transition: background-color .2s;
  
  &:hover{
    background-color: ${colors.background.memeCard.hover};
  }
`

const MemePreview = styled.img` 
  width: 100%;
`

const MetaDataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 4px;
  border-bottom: 1px solid ${colors.font.secondary};
`

const StyledMetaData = styled(MetaData)` 
    color: ${colors.font.secondary};
`

const VoteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: center;
  margin-top: 8px;

`

const Votes = styled.p<{isUpVote?: boolean}>` 
  color: ${(props) => props.isUpVote ? colors.font.votes.up : colors.font.votes.down};
`



export interface MemeCardType {
    memePath: string;
    author: string;
    formattedDate: string;
    amountOfComments: number;
    upVotes: number;
    downVotes: number;
}


export const MemeCard = ({memePath, amountOfComments, formattedDate, author, upVotes, downVotes}: MemeCardType) => {
    return (
        <StyledMemeCard>
            <MemePreview src={memePath}/>
            <MetaDataContainer>
                <StyledMetaData>{formattedDate}</StyledMetaData>
                <StyledMetaData>by {author}</StyledMetaData>
            </MetaDataContainer>
            <VoteContainer>
                <Votes isUpVote>▲ {upVotes}</Votes>
                <StyledMetaData>{amountOfComments} comments</StyledMetaData>
                <Votes>{downVotes} ▼</Votes>
            </VoteContainer>
        </StyledMemeCard>

    );
}