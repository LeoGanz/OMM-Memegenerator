import React, {PureComponent, useEffect} from 'react';
import {useContext, useState} from "react";
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import useWindowDimensions, {getWindowDimensions} from "../util/statistics";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const ExampleData = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    }
]

function transformToRechartTemplate (memeIds: string[], usages: number[]){
    let result = [];
    for (let i = 0; i < memeIds.length; i++){
        let usage = usages[i];
        let memeId = memeIds[i];
        let toAdd = {
            name:memeId,
            usage:usage,
        }
        result.push(toAdd);
    }
    return result;
}

export const TemplateGraph = () => {
    const {isLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    let jwt = "";
    const [memeIds, setMemeIds] = useState<string[]>([]);
    const [usages, setUsages] = useState<number[]>([]);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);
    if (isLoggedIn) {
        jwt = localStorage.getItem('meme-token') || "";
    }
    const {height, width} = useWindowDimensions();
    console.log(width, height);
    return (
        <>
            <LineChart
                width={width * (1 - 150 / 1920)}
                height={height * (1 - 200 / 1080)}
                data={ExampleData}
                margin={{
                    top: height * 150 / 1080,
                    right: width * 100 / 1920,
                    left: 0,
                    bottom: height * 10 / 1080
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#8884d8"
                    activeDot={{r: 8}}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d"/>
            </LineChart>
        </>
    )
}