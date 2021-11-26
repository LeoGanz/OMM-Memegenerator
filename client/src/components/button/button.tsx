import React from 'react';
import styled from "styled-components";
import {ButtonText} from "../layout/typography";
import {colors} from "../layout/colors";


const StyledButton = styled.button`
  background-color: ${colors.background.button};
  border: 1px solid ${colors.background.button};
  border-radius: 10px;
  padding: 8px 16px;
  display: flex;
  height: fit-content;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover{
    opacity: 90%;
  }
  
`

const StyledButtonText = styled(ButtonText)`
  color: ${colors.font.white};
`

const IconWrapper = styled.div``


interface ButtonProps {
    children?: any,
    icon?: JSX.Element;
    onClick?: any;
    disabled?: boolean;
}

export const Button = ({children, icon, onClick, disabled}: ButtonProps) => {
    return (
        <StyledButton disabled={disabled} onClick={onClick}>
            {children &&  <StyledButtonText>{children}</StyledButtonText>}
            {icon && <IconWrapper>{icon}</IconWrapper>}
        </StyledButton>
    );
}