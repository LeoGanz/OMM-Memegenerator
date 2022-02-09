import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {MemeInfos} from "../meme-infos/meme-infos";
import {up} from "../../util/breakpoint";
import {Title} from "../layout/typography";
import {SingleMemeType} from "../../util/typedef";

const MemeContainerWrapper = styled.div`

  background-color: ${colors.background.memeCard.default};
  border-bottom: 1px solid ${colors.background.memeCard.default};
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 15px;
  margin: 0 -15px;

  ${up('md')} {
    padding: 0 150px 15px;
    margin: 0;
  }
`
const Meme = styled.img`
  width: 100%;
  max-width: 1000px;
  margin-bottom: 15px;


`

const StyledMemeInfos = styled(MemeInfos)`
  margin-bottom: 30px;
`

const StyledTitle = styled(Title)`
  align-self: flex-start;
  margin-bottom: 4px;
`

const Description = styled.p`
  align-self: flex-start;
  margin-bottom: 20px;
`


export const MemeContainer = ({
                                  dataUrl,
    comments, name, desc,
                                  ...props
                              }: SingleMemeType) => {

    return (
        <MemeContainerWrapper>
            <StyledTitle>{name}</StyledTitle>
            <Description>{desc}</Description>
            <Meme src={dataUrl}/>
            <StyledMemeInfos setVoteHoverActive={(b => {})} comments={comments.length} {...props}/>
        </MemeContainerWrapper>
    )
}