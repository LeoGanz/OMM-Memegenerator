import {Title} from "../components/layout/typography";
import 'tui-image-editor/dist/tui-image-editor.css';
import './editor.css'
import BaseImageEditor from '@toast-ui/react-image-editor';
import styled from "styled-components";
import  {createRef, useRef, useState} from "react";
import {colors} from "../components/layout/colors";
import {TextInput} from "../components/text-input/input-field";
import {useForm} from "react-hook-form";
import {REQUIRED_FIELD_ERROR, URL_ERROR, URL_PATTERN} from "../constants";

const UploadOptions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const FileUpload = styled.input`
  display: none;
`


const StyledButton = styled.button`
  background-color: ${colors.background.button};
  border: 1px solid ${colors.background.button};
  border-radius: 10px;
  padding: 8px 16px;
  display: flex;
  height: fit-content;
  cursor: pointer;
  transition: opacity 0.2s;
  color: white;
  font-size: 14px;
  &:hover {
    opacity: 90%;
  }
`

export const Editor = () => {
    const {
        handleSubmit,
        control
    } = useForm<{ imageURL: string }>({
        mode: 'onSubmit',
    });
    const [uploadFromUrlActive, setUploadFromUrlActive] = useState<boolean>(false)
    const [hasImage, setHasImage] = useState<boolean>(false)
    const imageEditor = createRef()
    const fileInput = useRef<HTMLInputElement>(null);


    const handleFileUpload = (event: React.FormEvent) => {
        event.preventDefault();
        if (fileInput?.current?.files) {
            // @ts-ignore
            const imageEditorInst = imageEditor.current.imageEditorInst;
            imageEditorInst.loadImageFromFile(fileInput.current.files[0], "image-from-file")
            imageEditorInst.ui.activeMenuEvent()
        }
    }

    const onUrlUpload = ({imageURL}: { imageURL: string }) => {
        // @ts-ignore
        const imageEditorInst = imageEditor.current.imageEditorInst;
        imageEditorInst.loadImageFromURL(imageURL, "image-from-url")
        imageEditorInst.ui.activeMenuEvent()
        setUploadFromUrlActive(false)
    }


    return (
        <>
            <Title>Editor</Title>
            {uploadFromUrlActive ?
                <StyledForm name="sign-up" onSubmit={handleSubmit(onUrlUpload)}>
                    <TextInput name={'imageURL'} type={'text'} control={control}
                               rules={{
                                   required: REQUIRED_FIELD_ERROR,
                                   pattern: {value: URL_PATTERN, message: URL_ERROR}
                               }}/>
                    <StyledButton type="submit">Submit URL</StyledButton>

                </StyledForm> :
                <UploadOptions>
                    <StyledButton as="label">
                        Upload from File
                        <FileUpload
                            type="file"
                            ref={fileInput}
                            onChange={handleFileUpload}
                            onClick={(event) => {
                                (event.target as HTMLInputElement).value = "";
                            }}/>
                    </StyledButton>
                    <StyledButton onClick={() => {setUploadFromUrlActive(true)}}>
                        Use Image URL
                    </StyledButton>
                </UploadOptions>
            }

            <BaseImageEditor
                includeUI={{
                    menu: ['text', 'filter'],
                    menuBarPosition: 'bottom',
                    initMenu: ""

                }}
                usageStatistics={false}
                //@ts-ignore
                ref={imageEditor}
            />

        </>
    )
}