import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {MemeInfos} from "../meme-infos/meme-infos";
import {up} from "../../util/breakpoint";

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


interface MemeContainerProps {
    memePath: string;
    author: string;
    formattedDate: string;
    amountOfComments: number;
    upVotes: number;
    downVotes: number;
}

export const MemeContainer = ({
                                  memePath,
                                  ...props
                              }: MemeContainerProps) => {

    return (
        <MemeContainerWrapper>
            <Meme src={memePath}/>
            <StyledMemeInfos {...props}/>
        </MemeContainerWrapper>
    )
}