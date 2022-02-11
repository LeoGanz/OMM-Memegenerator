import styled from "styled-components";
import {StyledButton} from "../../pages/editor";

import {DownloadForm} from "./DownloadForm";
import {AutoPlayForm} from "./AutoPlayForm";

const ActionAreaDiv = styled.div`
  width: 100%;
  columns: 5;
  display: inline;
`

const AutoplayStyledButton = styled(StyledButton)`
  margin-top: 50%;
`

interface memeSingle {
    memeId: string,
    gap: string,
    currentAddress: string,
    next: Function,
}

export const ActionArea = ({memeId, currentAddress, gap, next}: memeSingle) => {

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

    return (
        <>
            <ActionAreaDiv>
                <StyledButton onClick={useCopyMemeId}>Copy MemeId</StyledButton>
                <AutoplayStyledButton onClick={useCopyURL}>Share</AutoplayStyledButton>
                <DownloadForm currentAddress={currentAddress} memeId={memeId}/>
                <AutoPlayForm memeId={memeId} gap={gap}
                              currentAddress={currentAddress} next={next}/>
            </ActionAreaDiv>
        </>
    )
}


