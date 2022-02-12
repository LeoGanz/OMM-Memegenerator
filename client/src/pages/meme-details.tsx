import React, {useContext, useEffect, useState} from 'react';
import {Comment} from "../components/comment/comment";
import {MemeContainer} from "../components/meme-container/meme-container";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {getJwt, objectToQuery} from "../util/jwt";
import LoginContext from "../login-context";
import {SingleMemeType} from "../util/typedef";
import {TextInput} from "../components/text-input/input-field";
import {useForm} from "react-hook-form";
import styled from "styled-components";
import {up} from "../util/breakpoint";
import {StyledButton} from "./editor";
import {REQUIRED_FIELD_ERROR} from "../constants";

const StyledForm = styled.form`
  margin: 30px 0;

  ${up('md')} {
    margin: 30px 150px;
  }
`


export const MemeDetails = () => {
    let {id} = useParams();
    let navigate = useNavigate()
    let isLoggedIn = useContext(LoginContext)
    const {
        handleSubmit,
        control, reset
    } = useForm<{ comment: string }>({
        mode: 'onSubmit',
    });
    let [searchParams, setSearchParams] = useSearchParams();
    const [memeData, setMemeData] = useState<SingleMemeType>()

    useEffect(() => {
        if (!id || !isLoggedIn) {
            navigate('/')
        }
        getMeme()
    }, [id, isLoggedIn])

    const getMeme = () => {
        const filterBy = searchParams.get("filterBy")
        const sortBy = searchParams.get("sortBy")
        let options = ""

        if(filterBy || sortBy){
            options = objectToQuery({filterBy, sortBy})
        }

        fetch('http://localhost:3000/image' + getJwt() + "&memeId=" + id + options, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            return response.text().then(response => {
                throw new Error(response)
            })
        })
            .then(r => {
                console.log(r)
                const {metadata, dataUrl, prev, next} = r;
                setMemeData({
                    ...metadata, dataUrl, memeId: id, prev, next
                })
            })
            .catch(err => window.alert(err.message))
    }

    const handleComment = ({comment}: { comment: string }) => {
        fetch('http://localhost:3000/images' + getJwt(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({memeId: id, comment})
        }).then(response => {
            if (response.ok) {
                getMeme()
                reset({comment: ""})
                return
            }
            return response.text().then(response => {
                throw new Error(response)
            })
        }).catch(err => window.alert(err.message))
    }

    return (
        <>
            {memeData && <MemeContainer searchParams={searchParams} {...memeData}/>}
            {memeData &&
                <StyledForm onSubmit={handleSubmit(handleComment)}>
                    <TextInput name={"comment"} type={"textarea"} control={control}
                               rules={{required: REQUIRED_FIELD_ERROR}}/>
                    <StyledButton type="submit">Add Comment</StyledButton>
                </StyledForm>
            }
            {memeData?.comments.map(({text, dateOfCreation, username}) => (
                <Comment author={username} date={dateOfCreation}>{text}</Comment>))}
        </>
    );
}

