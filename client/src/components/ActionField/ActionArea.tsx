import styled from "styled-components";
import {StyledButton} from "../../pages/editor";
import {TextInput} from "../text-input/input-field";

const ActionAreaDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  columns: 6;
`

interface memeSingle {
    memeId: string,
    autoplay: boolean,
    gap: number,
    currentAddress: string,
}


export const ActionArea = ({memeId, currentAddress, autoplay, gap}: memeSingle) => {
    const useCopyMemeId = () => {
        navigator.clipboard.writeText(memeId).then(() => {
            window.alert("Copying successful");
        }, f => {
            window.alert("Copying to clipboard not possible: " + f);
        });
    }

    const useCopyURL = () => {
        navigator.clipboard.writeText(currentAddress + "&memeId=" + memeId).then(() => {
            window.alert("Copying successful");
        }, f => {
            window.alert("Copying to clipboard not possible: " + f);
        });
    }

    const useDownload = () => {

    }

    const useAutoplay = () => {

    }

    return (
        <>
            <ActionAreaDiv>
                <StyledButton onClick={useCopyMemeId}>Copy memeId</StyledButton>
            </ActionAreaDiv>
        </>
    )
}


