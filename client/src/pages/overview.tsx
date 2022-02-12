import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {Title} from "../components/layout/typography";
import {MemeCard} from "../components/meme-card/meme-card";
import {colors} from "../components/layout/colors";
import {Link} from "react-router-dom";
import {getJwt, objectToQuery} from "../util/jwt";
import LoginContext from "../login-context";
import {SingleMemeType} from "../util/typedef";
import {TextInput} from "../components/text-input/input-field";
import {StyledButton} from "./editor";
import {useForm} from "react-hook-form";

export const ButtonLink = styled(Link)`
  background-color: ${colors.background.button};
  border: 1px solid ${colors.background.button};
  text-decoration: none;
  color: white;
  border-radius: 10px;
  padding: 8px 16px;
  display: flex;
  height: fit-content;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 90%;
  }
`

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 20px;
  row-gap: 20px;
  justify-items: stretch;
  align-items: start;
`

export const HeadlineSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SortAndFilterWrapper = styled.div`
  display: flex;
  background-color: ${colors.background.memeCard.default};
  margin-bottom: 20px;
  border-radius: 4px;
  padding: 10px;
  justify-content: space-between;
`

const Filter = styled.form`
    display: flex;
    align-items: center;
    gap: 50px;
`

const SortArea = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`


export const Overview = () => {
    const {isLoggedIn} = useContext(LoginContext)

    const {
        handleSubmit,
        control
    } = useForm<{ username: string }>({
        mode: 'onSubmit',
    });
    const [memeCardData, setMemeCardData] = useState<SingleMemeType[]>([])
    const [activeParams, setActiveParams] = useState<string>("")
    const [range, setRange] = useState({start: 0, end: 40})

    useEffect(() => {
        if (isLoggedIn) {
            loadMemes()
        }
    }, [isLoggedIn])

    const loadMemes = (filerByValue?: string, sortByValue?: string) => {

        const filterBy = filerByValue ? {filterBy: filerByValue} : {}
        const sortBy = sortByValue ? {sortBy: sortByValue} : {}
        const options = {status: 2, ...range, ...filterBy, ...sortBy}
        // @ts-ignore
        setActiveParams("?" + objectToQuery(options).slice(1))


        // @ts-ignore
        fetch('http://localhost:3000/images' + getJwt() + objectToQuery(options), {
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

                const data = r.map((meme: { metadata: any; dataUrl: any; }) => {
                    const {metadata, dataUrl} = meme;
                    return {...metadata, dataUrl}
                })
                setMemeCardData(data)

            })
            .catch(err => window.alert(err.message))
    }


    const filterByUsername = ({username}: { username: string }) => {
        loadMemes(username, undefined)
    }

    return (
        <>
            <HeadlineSection>
                <Title>Overview</Title>
                <ButtonLink to="/editor">+ Create your own meme</ButtonLink>
                <ButtonLink to="/api-doc">Go to API documentation</ButtonLink>
                <ButtonLink to="/single-graph">Show some statistics for single memes</ButtonLink>
                <ButtonLink to="/template-graph">Show some template statistics</ButtonLink>
            </HeadlineSection>

            <SortAndFilterWrapper onSubmit={handleSubmit(filterByUsername)}>
                <Filter>
                    <TextInput placeholder="Username" name={"username"} type={"text"} control={control}/>
                    <StyledButton type="submit">Search</StyledButton>
                </Filter>

                <SortArea>
                    <p>Sort by:</p>
                    <p>UpVotes</p>
                    <StyledButton onClick={() => loadMemes(undefined , "up asc")}>Asc</StyledButton>
                    <StyledButton onClick={() => loadMemes(undefined , "up desc")}>Desc</StyledButton>
                    <p>DownVotes</p>
                    <StyledButton onClick={() => loadMemes(undefined , "down asc")}>Asc</StyledButton>
                    <StyledButton onClick={() => loadMemes(undefined , "down desc")}>Desc</StyledButton>
                </SortArea>
            </SortAndFilterWrapper>

            <OverviewGrid>
                {memeCardData.map((memeCardEntry) =>
                    <MemeCard key={memeCardEntry.memeId} params={activeParams} {...memeCardEntry}/>
                )}
            </OverviewGrid>

        </>
    );
}