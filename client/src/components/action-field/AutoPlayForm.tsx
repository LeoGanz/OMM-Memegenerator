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
  columns: 3;
  width: 100%;
  padding: 1%;
  display: inline-table;
`

const FormTextInput = styled(TextInput)`
  width: 48%;
  padding: 1%;
`

const ToggleDiv = styled.div`
  columns:2;
  width:100%;
  padding: 1%;
  display: inline-table;
`

export const AutoPlayForm = ({memeId, currentAddress, gap, next}: memeSingle) => {
    const {
        handleSubmit,
        control
    } = useForm<memeSingle>({
        mode: 'onSubmit',
    });
    const useAutoplay = () => {

    }

    return (
        <>
            <form name="autoplay" onSubmit={handleSubmit(useAutoplay)}>
                <AutoplayDiv>
                    <FormTextInput name={'gap'} type={'number'} label={'Gap between Switches' +
                    ' in' +
                    ' Seconds'} control={control}/>
                    <ToggleDiv id="result">
                        <div><span id="status">No </span>Autoplay</div>
                        <label className="toggle">
                            <input type="checkbox" id="toggleswitch" />
                            <span className="roundbutton"/>
                        </label>
                    </ToggleDiv>
                </AutoplayDiv>
            </form>
        </>
    )
}