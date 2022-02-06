import React, {useEffect, useContext, useState} from 'react';
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import {HeadlineSection, ButtonLink} from "./overview";
import {
    useBottomMargin,
    useHeight,
    useRightMargin,
    useTopMargin,
    useWidth,
    useLeftMargin,
    SingleData,
    useLegendTopMargin,
    useLegendBottomMargin,
    useLegendLeftMargin,
    useLegendRightMargin
} from "../util/statistics";
import {
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, Bar
} from "recharts";
import {getJwt} from "../util/jwt";
import {Title} from "../components/layout/typography";

function transformToRechartSingle(memeIds: string[], ups: number[], downs: number[]) {
    let result = [];
    for (let i = 0; i < memeIds.length; i++) {
        let up = ups[i];
        let down = downs[i];
        let memeId = memeIds[i];
        let toAdd = {
            name: memeId,
            down: down,
            up: up,
        }
        result.push(toAdd);
    }
    console.log(result);
    return result;
}

export const SingleGraph = () => {
    const {isLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    let jwt = "";
    const [singleData, setSingleData] = useState<SingleData[]>();
    if (isLoggedIn) {
        jwt = localStorage.getItem('meme-token') || "";
    }
    useEffect(() => {
        if (isLoggedIn) {
            jwt = localStorage.getItem('meme-token') || "";
            fetch('http://localhost:3000/statistics/single' + getJwt(jwt), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(r => r.json()).then(r => {
                return setSingleData(transformToRechartSingle(r.memes, r.upVotes, r.downVotes));
            })
        } else {
            navigate('/login');
        }
    }, [])
    return (
        <>
            <HeadlineSection>
                <Title>Up- and DownVotes of Memes</Title>
                <ButtonLink to="/">Back to Overview Page</ButtonLink>
            </HeadlineSection>
            <BarChart
                width={useWidth()}
                height={useHeight()}
                data={singleData}
                margin={{
                    top: useTopMargin(),
                    right: useRightMargin(),
                    left: useLeftMargin(),
                    bottom: useBottomMargin(),
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" angle={90} textAnchor="start"/>
                <YAxis/>
                <Tooltip/>
                <Legend verticalAlign="top" height={useLegendBottomMargin()}/>
                <Bar dataKey="down"
                     stackId="a"
                     fill="#8884d8"
                />
                <Bar
                    dataKey="up"
                    stackId="a"
                    fill="#82ca9d"
                />
            </BarChart>
        </>
    )
}