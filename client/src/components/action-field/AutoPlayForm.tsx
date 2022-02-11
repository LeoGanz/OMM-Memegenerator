import {TextInput} from "../text-input/input-field";
import {useForm} from "react-hook-form";
import styled from "styled-components";
import "./button-styles.css";

interface memeSingle {
    memeId: string,
    gap: string,
    currentAddress: string,
    next: Function,
}

const AutoplayDiv = styled.div`
  columns: 2;
  width: 100%
`

const FormTextInput = styled(TextInput)`
  width:50%;
`

export const AutoPlayForm = ({memeId, currentAddress, gap, next}: memeSingle) => {
    const {
        handleSubmit,
        control
    } = useForm<memeSingle>({
        mode: 'onSubmit',
    });
    console.log(currentAddress);
    const useAutoplay = () => {

    }

    return (
        <>
            <form name="autoplay" onSubmit={handleSubmit(useAutoplay)}>
                <AutoplayDiv>
                    <FormTextInput name={'gap'} type={'text'} label={'gap between switches' +
                    ' in' +
                    ' seconds'} control={control}/>
                    <input type="submit"/>
                </AutoplayDiv>
            </form>
        </>
    )
}