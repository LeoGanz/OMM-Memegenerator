import React from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";

export const DivGroup = styled.div`
  column-count: 2;
  width: 100%;
  padding: 1%;
`
export const CommentGroup = styled.div`
  width: 98%;
  padding: 1%;
  display: inline-table;
`

export const ImageGroup = styled.div`
  width: 98%;
  padding: 1%;
  display: inline-table;
`

const WorkedImage = styled.div`
  width: 98%;
  padding: 1%;
  margin-bottom: 3%;
  column-count: 2;
`

const WorkedComment = styled.div`
  width: 98%;
  padding: 1%;
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
  color: black;
`

const CommentAndDate = styled.p`
  padding: 1%;
  color: black;
`

const CardButton = styled(Link)`
  width: 98%;
  padding: 1%;
  color: #efefef;

  &:hover {
    color: #007900;
    cursor: pointer;
  }
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
    console.log(src);
    src = "data:image/png;base64,"+src;
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
    console.log(src);
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

