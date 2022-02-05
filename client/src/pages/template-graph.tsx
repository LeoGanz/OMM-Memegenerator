import React, {useEffect, useContext, useState} from 'react';
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import {
    getBottomMargin, getHeight,
    useWindowDimensions, getRightMargin,
    getTopMargin,
    getWidth,
    getWindowDimensions, getLeftMargin
} from "../util/statistics";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import {getJwt} from "../util/jwt";
import {Title} from "../components/layout/typography";

function transformToRechartTemplate(memeIds: string[], usages: number[]) {
    let result = [];
    for (let i = 0; i < memeIds.length; i++) {
        let usage = usages[i];
        let memeId = memeIds[i];
        let toAdd = {
            name: memeId,
            usage: usage,
        }
        result.push(toAdd);
    }
    console.log(result);
    return result;
}

export const TemplateGraph = () => {
    const {isLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    let jwt = "";
    const [memeIds, setMemeIds] = useState<string[]>([]);
    const [usages, setUsages] = useState<number[]>([]);
    if (isLoggedIn) {
        jwt = localStorage.getItem('meme-token') || "";
    }
    useEffect(() => {
        if (isLoggedIn) {
            jwt = localStorage.getItem('meme-token') || "";
            fetch('http://localhost:3000/statistics/template' + getJwt(jwt), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(r => r.json()).then(r => {
                setMemeIds(r.templates);
                setUsages(r.usages);
            })
        } else {
            navigate('/login');
        }
    }, [])
    return (
        <>
            <Title>Usages of Templates</Title>
            <LineChart
                width={getWidth()}
                height={getHeight()}
                data={transformToRechartTemplate(memeIds, usages)}
                margin={{
                    top: getTopMargin(),
                    right: getRightMargin(),
                    left: getLeftMargin(),
                    bottom: getBottomMargin(),
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="Memes"/>
                <YAxis dataKey="Usages"/>
                <Tooltip/>
                <Legend/>
                <Line
                    type="monotone"
                    dataKey="usages"
                    stroke="#8884d8"
                    activeDot={{r: 8}}
                />
            </LineChart>
        </>
    )
}