import {TextInput} from "../text-input/input-field";
import styled from "styled-components";
import "./button-styles.css";

interface memeSingle {
    memeId: string,
    gap: string,
    currentAddress: string,
    timer: any,
}

interface time {
    time: string,
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
  columns: 2;
  width: 100%;
  padding: 1%;
  display: inline-table;
`

export const AutoPlayForm = ({memeId, currentAddress, gap, timer}: memeSingle) => {

    const doChange = () => {
        let checkBox: HTMLInputElement = document.getElementById("toggleswitch") as HTMLInputElement;
        if (checkBox.checked) {

        } else {

        }
    }

    return (
        <>
            <AutoplayDiv>
                <ToggleDiv>
                    <div><span id="status">No </span>Autoplay</div>
                    <label className="toggle">
                        <input type="checkbox" name="checkbox" id="toggleswitch"
                               onChange={doChange}/>
                        <span className="roundbutton"/>
                    </label>
                </ToggleDiv>
            </AutoplayDiv>
        </>
    )
}