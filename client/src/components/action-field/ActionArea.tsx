import styled from "styled-components";
import {DownloadForm} from "./DownloadForm";
import {AutoPlayForm} from "./AutoPlayForm";
import {getJwt, objectToQuery} from "../../util/jwt";
import {useNavigate} from "react-router-dom";
import {colors} from "../layout/colors";

const StyledButton = styled.button`
  background-color: ${colors.background.button};
  border: 1px solid ${colors.background.button};
  border-radius: 10px;
  padding: 8px 16px;
  display: flex;
  height: fit-content;
  cursor: pointer;
  transition: opacity 0.2s;
  color: white;
  font-size: 14px;

  &:hover {
    opacity: 90%;
  }
`

const ActionAreaDiv = styled.div`
  width: 100%;
  columns: 6;
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
    status: number,
}

export const ActionArea = ({memeId, currentAddress, searchParams, timer, status}: memeSingle) => {
    const filterBy = searchParams.get("filterBy");
    const sortBy = searchParams.get("sortBy");
    const navigate = useNavigate();
    let options = ""

    if (filterBy || sortBy) {
        options = objectToQuery({filterBy, sortBy})
    }
    const devdByCut = currentAddress.split("/");
    const locList = devdByCut[2].split(":");
    const loc = devdByCut[0] + "//" + locList[0] + ":" + "3000";
    const comp = loc + "/image" + getJwt() + options + "&memeId=" + memeId;

    const useCopyMemeId = () => {
        navigator.clipboard.writeText(memeId).then(() => {
            window.alert("Copying successful");
        }, f => {
            window.alert("Copying to clipboard not possible: " + f);
        });
    }

    const useCopyURL = () => {
        navigator.clipboard.writeText("http://localhost:8888/details/" + memeId + "?" + "end=40&start=0").then(() => {
            window.alert("Copying of URL to clipboard successful");
        }, f => {
            window.alert("Copying of URL to clipboard not possible: " + f);
        });
    }

    const split = currentAddress.split("/");
    const parts = split[split.length - 1].split("?");
    const parampart = "?" + parts[parts.length - 1];

    const useRandom = () => {
        fetch('http://localhost:3000/image' + getJwt() + "&random=1", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(response => {
                    throw new Error(response)
                })
            }
        }).then(r => {
            const memeId = r.metadata.memeId;
            navigate("/details/" + memeId + parampart);
        });
    }

    return (
        <>
            <ActionAreaDiv>
                <StyledButton onClick={useCopyMemeId}>Copy MemeId</StyledButton>
                <AutoplayStyledButton onClick={useCopyURL}>Share</AutoplayStyledButton>
                <DownloadForm currentAddress={comp} memeId={memeId}/>
                <StyledButton onClick={useRandom}>Go to random Image</StyledButton>
                <AutoPlayForm gap={searchParams.get("gap")}
                              currentAddress={currentAddress} timer={timer}/>
            </ActionAreaDiv>
        </>
    )
}


