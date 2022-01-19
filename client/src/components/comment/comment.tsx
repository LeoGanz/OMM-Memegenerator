import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {up} from "../../util/breakpoint";

const CommentWrapper = styled.div`
  margin: 30px 0;

  ${up('md')} {
    margin: 30px 150px;
  }
`

const Author = styled.p`
  font-weight: bold;
  margin-bottom: 6px;
  font-size: 14px;
`

const FormattedDate = styled.span`
  font-weight: normal;
  padding-left: 4px;
  color: ${colors.font.secondary};
`

const CommentText = styled.p`

`

interface CommentProps {
    author: string,
    date: string,
    children: React.ReactNode | React.ReactNode[]
}

export const Comment = ({author, date, children}: CommentProps) => {
    return (
        <CommentWrapper>
            <Author>{author}<FormattedDate>{date}</FormattedDate></Author>

            <CommentText>{children}</CommentText>
        </CommentWrapper>
    )
}
