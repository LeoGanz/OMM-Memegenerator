import {Title} from "../components/layout/typography";
import 'tui-image-editor/dist/tui-image-editor.css';
import styled from "styled-components";
import {createRef, useContext, useEffect, useRef, useState} from "react";
import {colors} from "../components/layout/colors";
import {TextInput} from "../components/text-input/input-field";
import {useForm} from "react-hook-form";
import {REQUIRED_FIELD_ERROR, URL_ERROR, URL_PATTERN} from "../constants";
import {ImageEditor} from "../components/image-editor/image-editor";
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import {getJwt} from "../util/jwt";

const MAX_TEXT_FIELDS = 100


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
    const {isLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    const {
        handleSubmit,
        control
    } = useForm<{ imageURL: string }>({
        mode: 'onSubmit',
    });

    const imageEditor = createRef()
    const fileInput = useRef<HTMLInputElement>(null);

    const [uploadFromUrlActive, setUploadFromUrlActive] = useState<boolean>(false)
    const [hasImage, setHasImage] = useState<boolean>(false)
    let jwt = ""


    useEffect(()=> {
        if(isLoggedIn){
            jwt = localStorage.getItem('meme-token') || ""
        }else {
            //todo add fallback for reload (try to use jwt from local storage)
            navigate('/login')
        }
    }, [])


    const handleSaveMeme = () => {
        // @ts-ignore
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const image = imageEditorInst.toDataURL();
        const texts = []
        const xCoordinates = []
        const yCoordinates = []

        for (let currentId = 2; currentId <= MAX_TEXT_FIELDS; currentId++) {
            const properties = imageEditorInst.getObjectProperties(currentId, ["type", "text", "left", "top"])
            if(properties?.type === "i-text"){
                const {text, left, top} = properties
                texts.push(text)
                xCoordinates.push(left)
                yCoordinates.push(top)
            }
        }

        const finalMeme = {
            //todo add missing fields
            //todo was ist status
            name: "TODO: name muss im Frontend noch hinzugefügt werden",
            desc: "TODO: desc muss im Frontend noch hinzugefügt werden",
            image,
            texts,
            xCoordinates,
            yCoordinates,
            status: 0,
            width: 1,
            height: 1,
            pixels: 1
        }

        console.log(finalMeme)
        console.log(getJwt(jwt))
        fetch('http://localhost:3000/editor' + getJwt(jwt), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalMeme)
        }).then(r => {console.log(r)})
    }

    const handleFileUpload = (event: React.FormEvent) => {
        event.preventDefault();
        if (fileInput?.current?.files) {
            // @ts-ignore
            const imageEditorInst = imageEditor.current.imageEditorInst;
            imageEditorInst.loadImageFromFile(fileInput.current.files[0], "image-from-file")
            imageEditorInst.ui.activeMenuEvent()

            setHasImage(true)
        }
    }

    const onUrlUpload = ({imageURL}: { imageURL: string }) => {
        // @ts-ignore
        const imageEditorInst = imageEditor.current.imageEditorInst;
        imageEditorInst.loadImageFromURL(imageURL, "image-from-url")
        imageEditorInst.ui.activeMenuEvent()

        setUploadFromUrlActive(false)
        setHasImage(true)
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

                    {hasImage && <StyledButton onClick={handleSaveMeme}>Save Meme</StyledButton>}
                </UploadOptions>
            }
            <ImageEditor editorRef={imageEditor} />
        </>
    )
}