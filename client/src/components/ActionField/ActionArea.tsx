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
    next: Function,
}

export const ActionArea = ({memeId, currentAddress, autoplay, gap, next}: memeSingle) => {
    const useCopyMemeId = () => {
        navigator.clipboard.writeText(memeId).then(() => {
            window.alert("Copying successful");
        }, f => {
            window.alert("Copying to clipboard not possible: " + f);
        });
    }

    const useCopyURL = () => {
        navigator.clipboard.writeText(currentAddress + "&memeId=" + memeId).then(() => {
            window.alert("Copying of URL to clipboard successful");
        }, f => {
            window.alert("Copying of URL to clipboard not possible: " + f);
        });
    }

    const useDownload = () => {
        let fileSize = document.getElementsByName("fileSize")[0];
        let value = fileSize.

        const downloadURL = currentAddress + "&memeId=" + memeId + "&targetFileSize=" + size;
        fetch()
    }

    const useAutoplay = () => {

    }

    return (
        <>
            <ActionAreaDiv>
                <StyledButton onClick={useCopyMemeId}>Copy memeId</StyledButton>
                <StyledButton onClick={useCopyURL}>Share</StyledButton>
                <TextInput name={'fileSize'} type={'text'} label={'download file size in MB'}/>
                <StyledButton onClick={useDownload}/>
            </ActionAreaDiv>
        </>
    )
}


