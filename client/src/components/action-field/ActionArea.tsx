import styled from "styled-components";
import {StyledButton} from "../../pages/editor";
import {DownloadForm} from "./DownloadForm";
import {AutoPlayForm} from "./AutoPlayForm";
import {getJwt, objectToQuery} from "../../util/jwt";

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
    searchParams: any,
    currentAddress: string,
    timer: Function,
}

export const ActionArea = ({memeId, currentAddress, searchParams, timer}: memeSingle) => {
    const filterBy = searchParams.get("filterBy");
    const sortBy = searchParams.get("sortBy");
    let options = ""

    if (filterBy || sortBy) {
        options = objectToQuery({filterBy, sortBy})
    }

    const devdByCut = currentAddress.split("/");
    console.log(devdByCut);
    const locList = devdByCut[2].split(":");
    console.log(locList)
    const loc = devdByCut[0] + "//" + locList[0] + ":" + "3000";
    const comp = loc + "/image" + getJwt() + options + "&memeId=" + memeId;
    console.log(comp);

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
                <DownloadForm currentAddress={comp} memeId={memeId}/>
                <AutoPlayForm memeId={memeId} gap={searchParams.get("gap")}
                              currentAddress={currentAddress} timer={timer}/>
            </ActionAreaDiv>
        </>
    )
}


