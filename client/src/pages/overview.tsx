import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {Title} from "../components/layout/typography";
import {MemeCard} from "../components/meme-card/meme-card";
import {colors} from "../components/layout/colors";
import {Link, useNavigate} from "react-router-dom";
import {getJwt, objectToQuery} from "../util/jwt";
import LoginContext from "../login-context";
import {MemeType} from "../util/typedef";

const ButtonLink = styled(Link)`
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
  &:hover{
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

const HeadlineSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`


export const Overview = () => {
    const {isLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    const [memeCardData, setMemeCardData] = useState<MemeType[]>([])
    let jwt

    useEffect(() => {
        if (isLoggedIn) {
            jwt = localStorage.getItem('meme-token') || ""
            fetch('http://localhost:3000/images' + getJwt(jwt) + objectToQuery({start: 0, end: 40, status: 2}), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({start:0, end:20})
            }).then(r => r.json()).then(r => setMemeCardData(r))
        } else {
            navigate('/login')
        }
    }, [])


    return (
        <>
            <HeadlineSection>
                <Title>Overview</Title>
                <ButtonLink to="/editor">+ Create your own meme</ButtonLink>
            </HeadlineSection>

            <OverviewGrid>
                {memeCardData.map((memeCardEntry) =>
                    <MemeCard {...memeCardEntry}/>
                )}
            </OverviewGrid>

        </>
    );
}