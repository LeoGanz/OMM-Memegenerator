import styled from "styled-components";
import {StyledButton} from "../../pages/editor";
import {TextInput} from "../text-input/input-field";
import {useForm} from "react-hook-form";
import {REQUIRED_FIELD_ERROR} from "../../constants";
import {SubTitle} from "../layout/typography";
import React, {useState} from "react";
// @ts-ignore
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

const SaveArea = styled.form`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: center;
`

const SizedSpan = styled.span`
  display: inline-block;
  width: 100px;
`

interface MetaData {
    title: string,
    description: string,
    status: number
}

interface MemeSaveAreaProps {
    handleSaveMeme: (title: string, description: string, status: number) => any
}

export const MemeSaveArea = ({handleSaveMeme}: MemeSaveAreaProps) => {
    const {
        handleSubmit,
        control,
        setValue
    } = useForm<MetaData>({
        mode: 'onSubmit',
    });

    const handleSave = ({title, description, status}: MetaData) => {
        handleSaveMeme(title, description, status)
    }

    const [activeInput, setActiveInput] = useState('title')
    const commands = [
        {
            command: '*',
            // @ts-ignore
            callback: (text: string) => setValue(activeInput, text, {
                shouldValidate: true,
                shouldDirty: true
            })
        }];
    const {
        transcript,
        listening,
        isMicrophoneAvailable,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands});

    function buildSpeechToTextControl(element: React.SetStateAction<string>) {
        return <>
            {!browserSupportsSpeechRecognition ?
                <span>Browser doesn't support speech recognition. Try Google Chrome!</span>
                :
                <> {!isMicrophoneAvailable ?
                    <span>Please allow mic access and reload page!</span>
                    :
                    <>
                        {/*<p>Microphone: {listening ? 'on' : 'off'}</p>*/}
                        <StyledButton onClick={() => {
                            setActiveInput(element);
                            SpeechRecognition.startListening();
                        }}>Dictate {element}
                        </StyledButton>
                        <SizedSpan>{listening && activeInput === element ? "Listening ..." : ""}</SizedSpan>
                        {/*<p>Transcript: {transcript}</p>*/}
                    </>
                }
                </>
            }
        </>;
    }

    return (
        <>
            <SubTitle>Save Options</SubTitle>
            <SaveArea onSubmit={handleSubmit(handleSave)}>
                <TextInput label={"Title"} name={"title"} type={"text"} control={control}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                {buildSpeechToTextControl('title')}
                <TextInput label={"Description"} name={"description"} type={"text"} control={control}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                {buildSpeechToTextControl('description')}
                <StyledButton type={"submit"} onClick={() => {
                    setValue("status", 0);
                }}>Save as Template</StyledButton>
                <StyledButton onClick={() => {
                    setValue("status", 1);
                }}>Save as Draft</StyledButton>
                <StyledButton onClick={() => {
                    setValue("status", 2);
                }}>Publish Meme</StyledButton>
            </SaveArea>
        </>
    )
}