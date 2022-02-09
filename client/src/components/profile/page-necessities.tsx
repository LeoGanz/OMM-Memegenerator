import React from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";

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
  display: inline-table;
`

export const ImageGroup = styled.div`
  width: 98%;
  padding: 1%;
  background: aqua;
  display: inline-table;
`

const WorkedImage = styled.div`
  width: 98%;
  padding: 1%;
  background: coral;
  margin-bottom: 3%;
  column-count: 2;
`

const WorkedComment = styled.div`
  width: 98%;
  padding: 1%;
  background: fuchsia;
  margin-bottom: 3%;
  column-count: 2;
`

const Image = styled.img`
  width: 40%;
  padding: 1%;
`

const Date = styled.p`
  width: 98%;
  padding: 1%;
`

const CommentAndDate = styled.p`
  padding: 1%;
`

const CardButton = styled(Link)`
  width: 98%;
  padding: 1%;
`

interface CommentCardProp {
    date: string,
    src: string,
    memeId: string,
    children: React.ReactNode | React.ReactNode[]
}

interface MemeCardProp {
    memeId: string,
    date: string,
    src: string,
}

export const CommentCardProfile = ({date, src, children, memeId}: CommentCardProp) => {
    return (
        <>
            <CardButton to={"/details/" + memeId}>
                <WorkedImage>
                    <Image src={src}/>
                    <CommentAndDate>Commented
                        on:{date} "{children}"</CommentAndDate>
                </WorkedImage>
            </CardButton>
        </>
    )
}
export const MemeCardProfile = ({date, src, memeId}: MemeCardProp) => {
    return (
        <>
            <CardButton to={"/editor/" + memeId}>
                <WorkedComment>
                    <Image src={src}/>
                    <Date>Edited on: {date}</Date>
                </WorkedComment>
            </CardButton>
        </>
    )
}

