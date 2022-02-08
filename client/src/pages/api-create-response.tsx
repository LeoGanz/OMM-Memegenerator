import {useEffect, useState} from "react";

interface APIcreate {
    memeId: string,
    memes: [{
        name: string,
        desc: string,
        texts: [string, string],
        xCoordinates: [number, number],
        yCoordinates: [number, number],
        fontSizes: [number, number],
        colors: [string, string],
    }, {
        name: string,
        desc: string,
        texts: [string, string],
        xCoordinates: [number, number],
        yCoordinates: [number, number],
        fontSizes: [number, number],
        colors: [string, string],
    }]
}


export const APICreateResponse = () => {

    const createBody: APIcreate = {
        memeId: "7279cccbdb13373a31994f293f863a6f",
        memes:
            [
                {
                    name: "nameOfMeme1",
                    desc: "descriptionOfMeme1",
                    texts: ["text1OfMeme1", "text2OfMeme1"],
                    xCoordinates: [111, 222],
                    yCoordinates: [111, 222],
                    fontSizes: [11, 22],
                    colors: ["#000000", "#0000FF"]
                },
                {
                    name: "nameOfMeme2",
                    desc: "descriptionOfMeme2",
                    texts: ["text1OfMeme2", "text2OfMeme2"],
                    xCoordinates: [333, 444],
                    yCoordinates: [333, 444],
                    fontSizes: [33, 44],
                    colors: ["#32CD32", "#800000"]
                }
            ]
    }

    const [Result, setResult] = useState<string>("");

    useEffect(() => {
        fetch('http://localhost:3000/create', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createBody)
        }).then(r => r.text()).then(r => setResult(r));
    })
    return (
        <>
            <p>{Result}</p>
        </>
    )
}