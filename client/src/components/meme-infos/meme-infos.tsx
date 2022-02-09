import React, {useState} from "react";
import styled from "styled-components";
import {colors} from "../layout/colors";
import {MetaData} from "../layout/typography";
import {getJwt} from "../../util/jwt";

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

const Votes = styled.p<{ isUpVote?: boolean, isTouched: boolean, disabled: boolean }>`
  z-index: 1;
  cursor: pointer;
  color: ${(props) => props.isUpVote ? colors.font.votes.up : colors.font.votes.down};
  ${(props) => props.isTouched && "text-decoration: underline"};

  &:hover {
    ${(props) => props.disabled ? "cursor: default" : `color: ${colors.font.default}`};
  }
`

export interface MemeInfoProps {
    setVoteHoverActive: (b: boolean) => any
    dateOfCreation: string,
    creator: string,
    comments: number,
    upVotes: number,
    downVotes: number,
    memeId: string
}


export const MemeInfos = ({
                              dateOfCreation,
                              creator,
                              comments,
                              upVotes,
                              downVotes,
                              setVoteHoverActive,
                              memeId
                          }: MemeInfoProps) => {
    const [isUpVoted, setIsUpVoted] = useState<boolean>(false)
    const [isDownVoted, setIsDownVoted] = useState<boolean>(false)
    const jwt = localStorage.getItem('meme-token') || ""

    const handleVote = (isUpVote: boolean) => {
        if (!isUpVoted && !isDownVoted) {
            const body = isUpVote ? {memeId, up: true} : {memeId, down: true}
            fetch('http://localhost:3000/images' + getJwt(jwt), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(response => {
                if (response.ok) {
                    isUpVote ? setIsUpVoted(true) : setIsDownVoted(true)
                    return
                }
                return response.text().then(response => {
                    throw new Error(response)
                })
            }).catch(err => window.alert(err.message))
        }
    }


    return (
        <>
            <MetaDataContainer>
                <StyledMetaData>{dateOfCreation}</StyledMetaData>
                <StyledMetaData>by {creator}</StyledMetaData>
            </MetaDataContainer>
            <VoteContainer>
                <Votes disabled={isDownVoted || isUpVoted} isTouched={isDownVoted} onClick={() => handleVote(false)}
                       onMouseEnter={() => setVoteHoverActive(true)}
                       onMouseLeave={() => setVoteHoverActive(false)}>{isDownVoted ? (downVotes + 1) : downVotes} ▼</Votes>
                <StyledMetaData>{comments} comments</StyledMetaData>
                <Votes disabled={isDownVoted || isUpVoted} isTouched={isUpVoted} onClick={() => handleVote(true)}
                       onMouseEnter={() => setVoteHoverActive(true)}
                       onMouseLeave={() => setVoteHoverActive(false)}
                       isUpVote>▲ {isUpVoted ? (upVotes + 1) : upVotes}</Votes>
            </VoteContainer>
        </>
    )
}