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
        size: string,
    }

    const {
        handleSubmit,
        control
    } = useForm<fileSize>({
        mode: 'onSubmit',
    });

    const useDownload = async ({size}: fileSize) => {
        if (size !== "" && size !== undefined) {
            const downloadURL = currentAddress + "&memeId=" + memeId + "&targetFileSize=" + size;
            fetch(downloadURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(r => {
                if (r.ok) {
                    console.log(r.text());
                    r.text().then(r => {
                        return r;
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
                    <FormTextInput control={control} name={'fileSize'} type={'text'}
                                   label={'download' +
                                   ' file size in MB'}/>
                    <input type="submit" value="Download"/>
                </DownloadDiv>
            </form>
        </>
    );
}