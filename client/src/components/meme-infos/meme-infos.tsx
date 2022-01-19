import React from "react";
import styled from "styled-components";
import {colors} from "../layout/colors";
import {MetaData} from "../layout/typography";

const MetaDataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 4px;
  border-bottom: 1px solid ${colors.font.secondary};
  width: 100%;
`

const StyledMetaData = styled(MetaData)`
  color: ${colors.font.secondary};
`

const VoteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: center;
  margin-top: 8px;
  width: 100%;
`

const Votes = styled.p<{ isUpVote?: boolean }>`
  color: ${(props) => props.isUpVote ? colors.font.votes.up : colors.font.votes.down};
`

export interface MemeInfoProps {
    author: string;
    formattedDate: string;
    amountOfComments: number;
    upVotes: number;
    downVotes: number;
}

export const MemeInfos = ({formattedDate, author, amountOfComments, upVotes, downVotes}: MemeInfoProps) => {

    return (
        <>
            <MetaDataContainer>
                <StyledMetaData>{formattedDate}</StyledMetaData>
                <StyledMetaData>by {author}</StyledMetaData>
            </MetaDataContainer>
            <VoteContainer>
                <Votes>{downVotes} ▼</Votes>
                <StyledMetaData>{amountOfComments} comments</StyledMetaData>
                <Votes isUpVote>▲ {upVotes}</Votes>
            </VoteContainer>
        </>
    )
}