import {SubTitle, Title} from "../components/layout/typography";
import 'tui-image-editor/dist/tui-image-editor.css';
import styled from "styled-components";
import {createRef, useContext, useEffect, useRef, useState} from "react";
import {colors} from "../components/layout/colors";
import {TextInput} from "../components/text-input/input-field";
import {useForm} from "react-hook-form";
import {DRAW_IMAGE_TEMPLATE, REQUIRED_FIELD_ERROR, URL_ERROR, URL_PATTERN} from "../constants";
import {ImageEditor} from "../components/image-editor/image-editor";
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import {getJwt, objectToQuery} from "../util/jwt";
import {Carousel} from "../components/carousel/carousel";
import {MemeType} from "../util/typedef";

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

const EditorWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const NavigationButton = styled.button`
  background-color: ${colors.background.button};
  border: none;
  border-radius: 10px;
  padding: 20px 8px;
  display: flex;
  height: fit-content;
  cursor: pointer;
  transition: opacity 0.2s;
  color: white;
  font-size: 14px;

  &:hover {
    opacity: 90%;
  }

  &:disabled {
    background-color: ${colors.background.memeCard.hover};
    cursor: default;
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
    const [base64, setBase64] = useState<string | undefined>(undefined)
    const [hasImage, setHasImage] = useState<boolean>(false)
    const [drawModeActive, setDrawModeActive] = useState<boolean>(false)

    const [templates, setTemplates] = useState<MemeType[]>([])
    const [templateIndex, setTemplateIndex] = useState<number | undefined>(undefined)

    const [usersCreation, setUsersCreations] = useState<MemeType[]>([])
    const [usersCreationIndex, setUsersCreationsIndex] = useState<number | undefined>(undefined)
    let jwt = ""


    useEffect(() => {
        if (isLoggedIn) {
            jwt = localStorage.getItem('meme-token') || ""
            fetch('http://localhost:3000/images' + getJwt(jwt) + objectToQuery({start: 0, end: 20}), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({start:0, end:20})
            }).then(r => r.json()).then(r => setTemplates(r))

            fetch('http://localhost:3000/images' + getJwt(jwt) + objectToQuery({start: 0, end: 20, status: 1}), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({start:0, end:20})
            }).then(r => r.json()).then(r => setUsersCreations(r))

        } else {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        const func = async () => {
            if (templateIndex !== undefined) {
                await setBase64(undefined)
                await setBase64(templates[templateIndex].img.base64)
            }
        }
        func()
    }, [templateIndex])

    useEffect(() => {
        const func = async () => {
            if (usersCreationIndex !== undefined) {
                await setBase64(undefined)
                await setBase64(usersCreation[usersCreationIndex].img.base64)
            }
        }
        func()
    }, [usersCreationIndex])


    const handleSaveMeme = () => {
        setBase64(undefined)
        // @ts-ignore
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const image = imageEditorInst.toDataURL();
        const texts = []
        const xCoordinates = []
        const yCoordinates = []

        for (let currentId = 2; currentId <= MAX_TEXT_FIELDS; currentId++) {
            const properties = imageEditorInst.getObjectProperties(currentId, ["type", "text", "left", "top"])
            if (properties?.type === "i-text") {
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

        fetch('http://localhost:3000/editor' + getJwt(jwt), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalMeme)
        }).then(r => {
            console.log(r)
        })
    }

    const handleFileUpload = (event: React.FormEvent) => {
        event.preventDefault();
        if (fileInput?.current?.files) {
            setBase64(undefined)
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

        setBase64(undefined)
        setUploadFromUrlActive(false)
        setHasImage(true)
    }

    const handleCarouselSelect = (index: number, from: string) => {
        console.log(index)
        if (from === "template") {
            setUsersCreationsIndex(undefined)
            setTemplateIndex(index)

        } else {
            setTemplateIndex(undefined)
            setUsersCreationsIndex(index)

        }
    }

    const next = () => {
        if(templateIndex !== undefined){
            setTemplateIndex(templateIndex + 1)
        }else if(usersCreationIndex !== undefined){
            setUsersCreationsIndex(usersCreationIndex + 1)
        }
    }
    const prev = () => {
        if(templateIndex !== undefined){
            setTemplateIndex(templateIndex - 1)
        }else if(usersCreationIndex !== undefined){
            setUsersCreationsIndex(usersCreationIndex - 1)
        }
    }
    const prevDisabled = usersCreationIndex === 0 || templateIndex === 0 || templateIndex === usersCreationIndex
    const nextDisabled = usersCreationIndex === usersCreation.length - 1 || templateIndex === templates.length -1 || templateIndex === usersCreationIndex

    return (
        <>
            <Title>Editor</Title>
            <SubTitle>Use a template</SubTitle>
            <Carousel currentSelection={templateIndex}
                      onCarouselSelect={(index) => handleCarouselSelect(index, "template")}
                      memes={templates}/>
            <SubTitle>Use your recent creations</SubTitle>
            <Carousel currentSelection={usersCreationIndex}
                      onCarouselSelect={(index) => handleCarouselSelect(index, "userCreation")}
                      memes={templates}/>
            <SubTitle>Or select an upload option</SubTitle>
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
                    {/*file upload button*/}
                    <StyledButton as="label">
                        Upload from File
                        <FileUpload
                            type="file"
                            ref={fileInput}
                            onChange={handleFileUpload}
                            onClick={(event) => {
                                setBase64(undefined);
                                (event.target as HTMLInputElement).value = "";
                            }}/>
                    </StyledButton>
                    {/*from URL upload button*/}
                    <StyledButton onClick={() => {
                        setBase64(undefined);
                        setUploadFromUrlActive(true)
                    }}>
                        Use Image URL
                    </StyledButton>
                    {/*draw own meme button*/}
                    <StyledButton onClick={async () => {
                        setDrawModeActive(true)
                        await setBase64(undefined)
                        await setBase64(DRAW_IMAGE_TEMPLATE);
                        setTemplateIndex(undefined)
                        setUsersCreationsIndex(undefined)

                    }}>
                        Drawn your own meme
                    </StyledButton>

                    {hasImage && <StyledButton onClick={handleSaveMeme}>Save Meme</StyledButton>}
                </UploadOptions>
            }
            <EditorWrapper>
                <NavigationButton onClick={prev} disabled={prevDisabled}>{"<"}</NavigationButton>
                <ImageEditor drawModeActive={drawModeActive} editorRef={imageEditor} base64String={base64}/>
                <NavigationButton onClick={next} disabled={nextDisabled}>{">"}</NavigationButton>
            </EditorWrapper>
        </>
    )
}