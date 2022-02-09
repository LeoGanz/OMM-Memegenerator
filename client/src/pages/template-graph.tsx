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
    TemplateData,
    useLegendBottomMargin,
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
    const [templateData, setTemplateData] = useState<TemplateData[]>();
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
            }).then(r => {
                if (r.ok) {
                    r.json().then(r => {
                        return setTemplateData(transformToRechartTemplate(r.templates, r.usages));
                    })}
                else
                    {
                        window.alert("Connection to server failed");
                    }
            });
        } else {
            navigate('/login');
        }
    }, [])
    return (
        <>
            <HeadlineSection>
                <Title>Usages of Templates</Title>
                <ButtonLink to="/">Back to Overview Page</ButtonLink>
            </HeadlineSection>
            <LineChart
                width={useWidth()}
                height={useHeight()}
                data={templateData}
                margin={{
                    top: useTopMargin(),
                    right: useRightMargin(),
                    left: useLeftMargin(),
                    bottom: useBottomMargin(),
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" angle={90} textAnchor="start" label="memeIds"/>
                <YAxis label="usages"/>
                <Tooltip/>
                <Legend verticalAlign="top" height={useLegendBottomMargin()}/>
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