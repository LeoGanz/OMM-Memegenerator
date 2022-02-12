import {TextInput} from "../text-input/input-field";
import styled from "styled-components";
import "./button-styles.css";
import {MyTimer} from "../timer/timer";
import {useNavigate} from "react-router-dom";

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

    let value = false;
    let time;
    if (gap !== undefined && gap !== null) {
        value = true;
        time = gap as unknown as number;
    } else {
        time = 60;
    }
    const navigate = useNavigate();

    const useChange = () => {
        let checkBox: HTMLInputElement = document.getElementById("toggleswitch") as HTMLInputElement;
        if (checkBox.checked) {
            let newUrl;
            if (!currentAddress.includes("gap")) {
                newUrl = currentAddress + "&gap=" + "20";
            } else {
                let newUrlArray = currentAddress.split("&");
                let newUrlArrayWithoutGap = newUrlArray.filter((elem) => {
                    return !elem.includes("gap");
                });
                newUrl = newUrlArrayWithoutGap.reduce((a, b) => {
                    return a + "&" + b;
                })
                newUrl = newUrl + "&gap=" + "30";
            }
            //TODO change numbers here
            const to = newUrl.split("/");
            const finalUrl = "/details/" + to[to.length - 1];
            navigate(finalUrl);
            const status = document.getElementById("status")
            if (status !== null) {
                status.innerHTML = "";
            }
            const restart = document.getElementById("restart");
            if (restart !== null) {
                restart.click();
            }
        } else {
            const status = document.getElementById("status")
            if (status !== null) {
                status.innerHTML = "No ";
                const restart = document.getElementById("restart");
                const pause = document.getElementById("pause");
                if (restart !== null) {
                    restart.click();
                    if (pause !== null) {
                        pause.click();
                    }
                }
            }
        }
    }

    return (
        <>
            <AutoplayDiv id="autoDiv">
                <ToggleDiv>
                    <div><span id="status">No </span>Autoplay</div>
                    <label className="toggle">
                        <input type="checkbox" name="checkbox" id="toggleswitch"
                               onChange={useChange} defaultChecked={value}/>
                        <span className="roundbutton"/>

                    </label>
                </ToggleDiv>
                <MyTimer add={time}
                         expireFunction={timer} aStart={value} newTime={30} id="timer"/>
            </AutoplayDiv>
        </>
    )
}