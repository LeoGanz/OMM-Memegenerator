import React from 'react';
import styled from "styled-components";
import {CommentText, FormattedDate, CommentWrapper} from "../comment/comment";
import {colors} from "../layout/colors";

export const DivGroup = styled.div`
  column-count: 2;
  width: 100%;
  background: #00c400;
  padding: 1%;
`
export const CommentGroup = styled.div`
  width: 98%;
  padding: 1%;
  background: brown;
`

export const ImageGroup = styled.div`
  width: 98%;
  padding: 1%;
  background: aqua;
`

export const WorkedImage = styled.div`
  width: 98%;
  padding: 1%;
  background: coral;
  margin-bottom: 3%;
  column-count: 2;
`

export const WorkedComment = styled.div`
  width: 98%;
  padding: 1%;
  background: fuchsia;
  margin-bottom: 3%;
  column-count: 2;
`

export const Image = styled.p`
  width: 98%;
  padding: 1%;
`

export const Date = styled.p`
  width: 98%;
  padding: 1%;
`

export const CommentAndDate = styled.p`
  width: 98%;
  padding: 1%;
  color: ${colors.font.secondary};
`

interface CommentCardProp {
    date: string,
    src: string,
    children: React.ReactNode | React.ReactNode[]
}

interface MemeCardProp {
    date: string,
    src: string,
}


export const CommentCardProfile = ({date, src, children}: CommentCardProp) => {
    return (
        <>
            <WorkedImage>
                <Image>{src}</Image>
                <CommentAndDate>Commented on:{date} "{children}"</CommentAndDate>
            </WorkedImage>
        </>
    )
}
export const MemeCardProfile = ({date, src}: MemeCardProp) => {
    return (
        <>
            <WorkedComment>
                <Image>{src}</Image>
                <Date>Edited on: {date}</Date>
            </WorkedComment>
        </>
    )
}

