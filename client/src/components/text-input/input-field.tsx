import React from 'react';
import styled, {css} from 'styled-components';
import {useController, UseControllerProps} from 'react-hook-form';

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  height: 48px;
  padding-left: 16px;
  padding-right: 16px;
  ${(props) =>
          props.hasError &&
          css`
            border: 2px solid red;
          `};
`;
const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  height: 48px;

  resize: vertical;
  ${(props) =>
          props.hasError &&
          css`
            border: 2px solid red;
          `};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
`;

export const StyledErrorMessage = styled.span`
  font-weight: 700;
  display: block;
  margin-top: 4px;
  color: red;
`;

export const TextInput = (
    props: UseControllerProps<any> & { placeholder?: string, label?: string, type: string },
) => {
    const {field, fieldState, formState} = useController(props);
    const errorMessage = fieldState?.error?.message;


    return (
        <div>
            {props.label && (
                <Label htmlFor={props.name}>
                    {props.label}{' '}
                    {props?.rules?.required && <span aria-hidden={true}>*</span>}
                </Label>
            )}
            {props.type === "textarea" ?
                <TextArea
                    aria-required={true}
                    hasError={Boolean(errorMessage)}
                    disabled={formState.isSubmitting}
                    id={props.name}
                    placeholder={props?.placeholder}
                    {...field}
                    value={field?.value || ''}
                    {...props}

                />
                :
                <Input
                    aria-required={true}
                    hasError={Boolean(errorMessage)}
                    disabled={formState.isSubmitting}
                    id={props.name}
                    placeholder={props?.placeholder}
                    {...field}
                    value={field?.value || ''}
                    {...props}

                />
            }

            {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
        </div>
    );
};