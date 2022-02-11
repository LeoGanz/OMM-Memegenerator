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
}


export const ActionArea = ({memeId, autoplay, gap}: memeSingle) => {
    const useCopyMemeId = () => {

    }

    const useCopyURL = () => {

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


