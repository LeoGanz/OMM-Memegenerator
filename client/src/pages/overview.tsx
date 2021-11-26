import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Title} from "../components/layout/typography";
import {MemeCard, MemeCardType} from "../components/meme-card/meme-card";
import {Button} from "../components/button/button";

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
    const [memeCardData, setMemeCardData] = useState<MemeCardType[]>([])

    useEffect(() => {
        //todo replace mock data with data from api
        const mockData: MemeCardType[] = new Array(100).fill(null).map(() =>
            ({
                memePath: "https://assets.justinmind.com/wp-content/uploads/2018/11/Lorem-Ipsum-alternatives-768x492.png",
                author: "SampleUser53",
                formattedDate: "26.11.21",
                upVotes: Math.floor(Math.random() * 1000),
                downVotes: Math.floor(Math.random() * 1000),
                amountOfComments: Math.floor(Math.random() * 1000)
            })
        )
        setMemeCardData(mockData)
    }, [])

    return (
        <>
            <HeadlineSection>
                <Title>Overview</Title>
                <Button>+ Create your own meme</Button>
            </HeadlineSection>

            <OverviewGrid>
                {memeCardData.map((memeCardEntry) =>
                    <MemeCard memePath={memeCardEntry.memePath}
                              author={memeCardEntry.author}
                              formattedDate={memeCardEntry.formattedDate}
                              amountOfComments={memeCardEntry.amountOfComments}
                              upVotes={memeCardEntry.upVotes}
                              downVotes={memeCardEntry.downVotes}/>
                )}
            </OverviewGrid>

        </>
    );
}