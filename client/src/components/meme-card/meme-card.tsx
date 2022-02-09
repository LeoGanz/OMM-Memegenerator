import React, {useState} from 'react';
import styled, {css} from "styled-components";
import {colors} from "../layout/colors";
import {up} from "../../util/breakpoint";
import {MemeInfos} from "../meme-infos/meme-infos";
import {Link} from "react-router-dom";
import {MemeType} from "../../util/typedef";


const StyledMemeCard = styled(Link)<{voteHoverActive: boolean}>`
  background-color: ${colors.background.memeCard.default};
  border: 1px solid ${colors.background.memeCard.default};
  border-radius: 4px;
  padding: 10px;
  grid-column-start: span 12;
  cursor: pointer;
  transition: background-color .2s;
  text-decoration: none;

  ${up('sm')} {
    grid-column-start: span 6;
  }

  ${up('md')} {
    grid-column-start: span 4;
  }

  ${up('lg')} {
    grid-column-start: span 3;
  }
  
  ${props => !props.voteHoverActive && css`
    &:hover {
      background-color: ${colors.background.memeCard.hover};
    }
  `}

`

const MemePreview = styled.img`
  width: 100%;
`


export const MemeCard = ({params ,img, memeId, creator, comments, upVoters, downVoters, dateOfCreation}: MemeType & {params: string}) => {
    const [voteHoverActive, setVoteHoverActive] = useState<boolean>(false)
    return (
        <StyledMemeCard voteHoverActive={voteHoverActive} to={voteHoverActive? "/" : "/details/" + memeId + params}>
            <MemePreview src={img.base64}/>
            <MemeInfos setVoteHoverActive={setVoteHoverActive} creator={creator?.username} comments={comments?.length || 0} upVotes={upVoters?.length || 0} downVotes={downVoters?.length || 0} memeId={memeId} dateOfCreation={dateOfCreation}/>
        </StyledMemeCard>

    );
}