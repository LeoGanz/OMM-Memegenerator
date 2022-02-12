import styled from "styled-components";
import {StyledButton} from "../../pages/editor";
import {TextInput} from "../text-input/input-field";
import {useForm} from "react-hook-form";
import {REQUIRED_FIELD_ERROR} from "../../constants";
import {SubTitle} from "../layout/typography";


const SaveArea = styled.form`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: center;
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

    return (
        <>
            <SubTitle>Save Options</SubTitle>
            <SaveArea onSubmit={handleSubmit(handleSave)}>
                <TextInput label={"Title"} name={"title"} type={"text"} control={control}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                <TextInput label={"Description"} name={"description"} type={"text"} control={control}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
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