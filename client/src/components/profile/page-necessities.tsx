import React from 'react';
import styled from "styled-components";
import {CommentText, FormattedDate, CommentWrapper} from "../comment/comment";

const CommentGroup = styled.div`
  display: grid;
  column-count: 2;
  column-gap: 10px;
  justify-items: stretch;
  align-items: start;
`

interface CommentCardProp {
    date: string,
    src: string,
    children: React.ReactNode | React.ReactNode[]
}

const MemePreview = styled.img`
  width: 50%;
  height: 50%;
`


export const CommentCard = ({date, src, children}: CommentCardProp) => {
    return (
        <CommentGroup>
            <MemePreview src={src}/>
            <CommentWrapper>
                <FormattedDate>{date}</FormattedDate>
                <CommentText>{children}</CommentText>
            </CommentWrapper>
        </CommentGroup>

    )
}

