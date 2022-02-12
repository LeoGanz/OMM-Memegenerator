import {TextInput} from "../text-input/input-field";
import styled from "styled-components";
import "./button-styles.css";
import {MyTimer} from "../timer/timer";

interface memeSingle {
    memeId: string,
    gap: string,
    currentAddress: string,
    timer: Function,
}


const AutoplayDiv = styled.div`
  columns: 3;
  width: 100%;
  padding: 1%;
  display: grid;
`

const FormTextInput = styled(TextInput)`
  width: 48%;
  padding: 1%;
`

const ToggleDiv = styled.div`
  columns: 3;
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
    let checked = "unchecked";
    let value = false;
    let time;
    console.log(gap);
    if (gap !== undefined && gap !== null) {
        checked = "checked";
        value = true;
        time = gap as unknown as number;
    }else{
        time = 0;
    }
    const end = new Date();
    end.setSeconds(end.getSeconds() + time);
    console.log(end);
    return (
        <>
            <AutoplayDiv>

                <ToggleDiv>
                    <div><span id="status">No </span>Autoplay</div>
                    <label className="toggle">
                        <input type="checkbox" name="checkbox" id="toggleswitch"
                               onChange={doChange} checked={value} value={checked}
                               defaultChecked={value}/>
                        <span className="roundbutton"/>
                    </label>
                </ToggleDiv>
                <MyTimer expiryTimestamp={time} onExpire={timer} id="timer"/>
            </AutoplayDiv>
        </>
    )
}