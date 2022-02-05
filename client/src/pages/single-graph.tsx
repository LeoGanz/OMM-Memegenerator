import React, {useEffect, useContext, useState} from 'react';
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import {
    getBottomMargin, getHeight, getRightMargin,
    getTopMargin,
    getWidth,
    getLeftMargin
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
    const [memeIds, setMemeIds] = useState<string[]>([]);
    const [ups, setUps] = useState<number[]>([]);
    const [downs, setDowns] = useState<number[]>([]);
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
                setMemeIds(r.memes);
                setUps(r.upVotes);
                setDowns(r.downVotes);
            })
        } else {
            navigate('/login');
        }
    }, [])
    return (
        <>
            <Title>Up- and DownVotes of Memes</Title>
            <BarChart
                width={getWidth()}
                height={getHeight()}
                data={transformToRechartSingle(memeIds, ups, downs)}
                margin={{
                    top: getTopMargin(),
                    right: getRightMargin(),
                    left: getLeftMargin(),
                    bottom: getBottomMargin(),
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="Memes"/>
                <YAxis dataKey="UpVotes/DownVotes"/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="downVotes"
                    stackId="a"
                    fill="#8884d8"
                />
                <Bar
                    dataKey="upVotes"
                    stackId="a"
                    fill="#82ca9d"
                />

            </BarChart>
        </>
    )
}