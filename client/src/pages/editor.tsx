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
import {getJwt, objectToQuery} from "../util/jwt";
import {Carousel} from "../components/carousel/carousel";
import {MemeTextType, SingleMemeType} from "../util/typedef";
import {MemeSaveArea} from "../components/meme-save-area/meme-save-area";
import {ButtonLink} from "./overview";

const MAX_TEXT_FIELDS = 100

const EditMode = styled.div<{ show: boolean }>`
  ${props => !props.show && "display: none"};
`

const SuccessMode = styled.div`
  button {
    width: fit-content;
    display: inline-block;
    margin-left: 8px;
    
  }
  
  a {
    width: fit-content;
    display: inline-block;
  }
`

const PreviewImage = styled.img`
  margin-top: 8px;
  width: 100%;
`

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

export const StyledButton = styled.button`
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

export const NavigationButton = styled.button`
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
    const [finishedMeme, setFinishedMeme] = useState<string>("")
    const [hasImage, setHasImage] = useState<boolean>(false)
    const [drawModeActive, setDrawModeActive] = useState<boolean>(false)


    const [templates, setTemplates] = useState<SingleMemeType[]>([])
    const [templateIndex, setTemplateIndex] = useState<number | undefined>(undefined)

    const [usersCreation, setUsersCreations] = useState<SingleMemeType[]>([])
    const [usersCreationIndex, setUsersCreationsIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (isLoggedIn) {
            fetch('http://localhost:3000/images' + getJwt() + objectToQuery({start: 0, end: 20, status: 0}), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({start:0, end:20})
            }).then(response => {
                if (response.ok) {
                    return response.json()
                }
                return response.text().then(response => {
                    throw new Error(response)
                })
            }).then(r => {
                const data = r.map((meme: { metadata: any; dataUrl: any; }) => {
                    const {metadata, dataUrl} = meme;
                    if (dataUrl) {
                        return {...metadata, dataUrl}
                    }
                })
                console.log(r)
                setTemplates(data)

            }).catch(err => {
                console.log(err.message)
            })

            fetch('http://localhost:3000/images' + getJwt() + objectToQuery({start: 1, end: 20, status: 1}), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({start:0, end:20})
            }).then(response => {
                if (response.ok) {
                    return response.json()
                }
                return response.text().then(response => {
                    throw new Error(response)
                })
            }).then(r => {
                const data = r.map((meme: { metadata: any; dataUrl: any; }) => {
                    const {metadata, dataUrl} = meme;
                    if (dataUrl) {
                        return {...metadata, dataUrl}
                    }
                })
                setUsersCreations(data)
            }).catch(err => {
                console.log(err.message)
            })
        }
    }, [isLoggedIn])

    useEffect(() => {
        const func = async () => {
            if (usersCreationIndex !== undefined) {
                setHasImage(true)

                setDrawModeActive(false)
                await setBase64(undefined)
                await setBase64(usersCreation[usersCreationIndex].dataUrl)
            }
        }
        func()
    }, [usersCreationIndex])

    useEffect(() => {
        const func = async () => {
            if (templateIndex !== undefined) {
                setHasImage(true)
                setDrawModeActive(false)
                await setBase64(undefined)
                await setBase64(templates[templateIndex].dataUrl)
            }
        }
        func()
    }, [templateIndex])


    const setText = (texts: MemeTextType[]) => {
        texts.forEach(textObj => {

            const {text, color, xCoordinate, yCoordinate, fontSize} = textObj

            setTimeout(() => {
                // @ts-ignore
                const imageEditorInst = imageEditor.current.imageEditorInst;
                imageEditorInst.addText(text, {
                    styles: {
                        fill: color,
                        fontSize,
                        fontWeight: 'bold'
                    },
                    position: {
                        x: xCoordinate,
                        y: yCoordinate
                    }
                })
                imageEditorInst.deactivateAll();
                imageEditorInst.stopDrawingMode();
                console.log("Alive")
            }, 100)
        })
    }


    const handleSaveMeme = (title: string, description: string, status: number) => {

        // @ts-ignore
        const imageEditorInst = imageEditor.current.imageEditorInst;
        const image = imageEditorInst.toDataURL();


        const imageForData = new Image()
        imageForData.onload = () => {

            // @ts-ignore
            const texts = []
            // @ts-ignore
            const xCoordinates = []
            // @ts-ignore
            const yCoordinates = []
            // @ts-ignore
            const fontSizes = []
            // @ts-ignore
            const colors = []
            let width = 0;
            let height = 0;
            let pixels = 0;

            width = imageForData.width
            height = imageForData.height
            pixels = width * height

            for (let currentId = 2; currentId <= MAX_TEXT_FIELDS; currentId++) {
                const properties = imageEditorInst.getObjectProperties(currentId, ["type", "text", "left", "top", "fill", "fontSize"])
                if (properties?.type === "i-text") {
                    const {text, left, top, fill, fontSize} = properties
                    texts.push(text)
                    xCoordinates.push(left)
                    yCoordinates.push(top)
                    colors.push(fill)
                    fontSizes.push(fontSize)
                    setTimeout(() => {
                        imageEditorInst.removeObject(currentId)
                    }, 10)

                }

            }

            setTimeout(() => {
                const finalImage = imageEditorInst.toDataURL();

                const finalMeme = {
                    //todo add missing fields
                    //todo was ist status
                    name: title,
                    desc: description,
                    image: finalImage,
                    // @ts-ignore
                    texts, xCoordinates, yCoordinates, fontSizes, colors,
                    status,
                    width,
                    height,
                    pixels,
                }


                fetch('http://localhost:3000/editor' + getJwt(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finalMeme)
                }).then(() => {
                    setFinishedMeme(image)
                })
            }, 1000)


        }
        imageForData.src = image
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
        if (templateIndex !== undefined) {
            setTemplateIndex(templateIndex + 1)
        } else if (usersCreationIndex !== undefined) {
            setUsersCreationsIndex(usersCreationIndex + 1)
        }
    }
    const prev = () => {
        if (templateIndex !== undefined) {
            setTemplateIndex(templateIndex - 1)
        } else if (usersCreationIndex !== undefined) {
            setUsersCreationsIndex(usersCreationIndex - 1)
        }
    }
    const prevDisabled = usersCreationIndex === 0 || templateIndex === 0 || templateIndex === usersCreationIndex
    const nextDisabled = usersCreationIndex === usersCreation.length - 1 || templateIndex === templates.length - 1 || templateIndex === usersCreationIndex


    return (
        <>
            {finishedMeme &&
                <SuccessMode>
                    <Title>Your meme was successfully uploaded!</Title>
                    <ButtonLink to={'/'}>Back to Overview</ButtonLink>
                    <StyledButton onClick={()=>{
                        let a = document.createElement("a");
                        a.href = finishedMeme
                        a.download = "Meme.jpeg";
                        a.click();
                    }
                    }>Download your Meme</StyledButton>
                <PreviewImage src={finishedMeme}/>
            </SuccessMode>}
            <EditMode show={!Boolean(finishedMeme)}>
                <Title>Editor</Title>

                {templates.length !== 0 && <>
                    <SubTitle>Use a template</SubTitle>
                    <Carousel currentSelection={templateIndex}
                              onCarouselSelect={(index) => handleCarouselSelect(index, "template")}
                              memes={templates}/></>
                }

                {usersCreation.length !== 0 &&
                    <>
                        <SubTitle>Use your recent creations</SubTitle>
                        <Carousel currentSelection={usersCreationIndex}
                                  onCarouselSelect={(index) => handleCarouselSelect(index, "userCreation")}
                                  memes={usersCreation}/>
                    </>}
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
                                    setDrawModeActive(false);
                                    setTemplateIndex(undefined);
                                    setUsersCreationsIndex(undefined);
                                    (event.target as HTMLInputElement).value = "";
                                }}/>
                        </StyledButton>
                        {/*from URL upload button*/}
                        <StyledButton onClick={() => {
                            setDrawModeActive(false)
                            setBase64(undefined);
                            setUploadFromUrlActive(true)
                            setTemplateIndex(undefined)
                            setUsersCreationsIndex(undefined)

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
                            setHasImage(true)

                        }}>
                            Drawn your own meme
                        </StyledButton>
                    </UploadOptions>
                }
                {hasImage && <MemeSaveArea handleSaveMeme={handleSaveMeme}/>}
                {(templateIndex !== undefined || usersCreationIndex !== undefined) && <StyledButton onClick={() => {
                    if (templateIndex !== undefined) {
                        setText(templates[templateIndex].texts)
                    } else if (usersCreationIndex !== undefined) {
                        setText(usersCreation[usersCreationIndex].texts)
                    }
                }}>
                    Load Text into Meme
                </StyledButton>}
                <EditorWrapper>
                    <NavigationButton onClick={prev} disabled={prevDisabled}>{"<"}</NavigationButton>
                    <ImageEditor drawModeActive={drawModeActive} editorRef={imageEditor} base64String={base64}/>
                    <NavigationButton onClick={next} disabled={nextDisabled}>{">"}</NavigationButton>
                </EditorWrapper>
            </EditMode>
        </>
    )
}