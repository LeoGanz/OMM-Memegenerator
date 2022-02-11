import {useForm} from "react-hook-form";
import {TextInput} from "../text-input/input-field";
import "./button-styles.css";
import styled from "styled-components";

interface downloadForm {
    currentAddress: string,
    memeId: string,
}

const FormTextInput = styled(TextInput)`
  width: 48%;
  padding: 1%;
`

const DownloadDiv = styled.div`
  columns: 2;
  width: 100%;
  padding: 1%;
  display: inline-table;
`

export const DownloadForm = ({currentAddress, memeId}: downloadForm) => {
    interface fileSize {
        fileSize: string,
    }

    const {
        handleSubmit,
        control
    } = useForm<fileSize>({
        mode: 'onSubmit',
    });

    const useDownload = async ({fileSize}: fileSize) => {
        if (fileSize !== "" && fileSize !== undefined) {
            const downloadURL = currentAddress + "&targetFileSize=" + fileSize;

            console.log("&memeId=" + memeId + "&targetFileSize=" + fileSize);
            fetch(downloadURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(r => {
                if (r.ok) {
                    r.json().then(r => {
                        let a = document.createElement("a");
                        a.href = r.dataUrl;
                        a.download = "Meme.jpeg";
                        a.click();
                    });
                } else {
                    window.alert("Something with downloading did not work out");
                }
            });
        } else {
            window.alert("You need to define a filesize in the textfield");
        }
    }

    return (
        <>
            <form name="download" onSubmit={handleSubmit(useDownload)}>
                <DownloadDiv>
                    <FormTextInput control={control} name={'fileSize'} type={'number'}
                                   label={'Download' +
                                   ' File Size in Byte'}/>
                    <input type="submit" value="Download"/>
                </DownloadDiv>
            </form>
        </>
    );
}