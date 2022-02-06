import {Title} from "../components/layout/typography";
import styled from "styled-components";


const Wrapper = styled.p`
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  font-size: 1.5em;
  color: blue;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const ApiSubTitle = styled.h3`
  font-size: 20px;
  margin-top: 2em;
  margin-bottom: 1em;
`


const openRetrieve = () => {
    window.open("http://localhost:3000/retrieve?numberOfMemes=10");
}

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

const createBody: APIcreate = {
    memeId: "b717756bf5921681aa91b08feb1af324",
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

    console.log(JSON.stringify(createBody))

const openCreate = () => {
    fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createBody),
    }).then(r => { //TODO: check if this is working like in editor
        const status = r.status;
        console.log(r);
        if (status === 200) {
            window.alert("Your memes were successfully uploaded");
        } else {
            window.alert("Something went wrong with the upload");
        }
    })
}


export const APIDoc = () => {
    return (
        <>
            <Title>
                Documentation - API
            </Title>
            <ApiSubTitle>
                Retrieving Memes
            </ApiSubTitle>
            <p>
                For retrieving memes a machine needs to make a GET-request. There need to be certain
                parameters given
                within the query. An essential parameter needed to be
                given is the number of memes to retrieve as Integer-value. Sending every meme is too
                much for the API, so this is needed.
                The optional parameters are for searching memes. You can search for texts in memes.
                Therefore give a String to the
                query-parameter "text". Another parameter is the username of the creator. Therefore
                give a String to the query parameter
                "username". The last possible parameter is the creation date of the meme in
                String-format needed to be given to the parameter "creationDate".
                The format is JJJJ-MM-TT, but leave out the leading zeros. So the first of February
                123 looks like this: 123-2-1.
            </p>
            <p></p>
            <p>
                An example request would look like this:
            </p>
            <Wrapper onClick={openRetrieve}>
                GET
                localhost:3000/retrieve?numberOfMemes=10&text=Hello&creatorName=someName&creationDate=2022-2-2
            </Wrapper>
            <p>
                If you click on the URL. You get to a new page giving back URLs to every meme
                found for these parameters given.
            </p>

            <ApiSubTitle>
                Creating Memes
            </ApiSubTitle>
            <p>
                For creating memes with the API there is a POST-request needed. There you need to
                specify everything about the meme
                in the JSON-body of the request. The first thing needed to be specified is the
                "memeId" of the Template you want to
                use for the meme. You can for example get this out of the URL given from the
                retrieve route above under the query-parameter
                "memeId". Then you need to give an array under the parameter "memes". Every element
                out of the array is a meme being created.
                This element has to have the same structure: It is a class with the "name" as the
                name of the meme; the "desc", the
                description of the meme; the "texts" an array of String-texts being placed on the
                meme; the "xCoordinates" mapping to
                the texts and describing the xCoordinates of the texts; same for "yCoordinates",
                "fontSizes" and "colors". These arrays
                have to have the same length and "texts" and "colors" need to be Strings (colors
                need to be supported by HTML 5 Canvas API)
                as and "xCoordinates", "yCoordinates" and "fontSizes" need to be numbers.
            </p>
            <p></p>
            <p>
                An example request would look like this:
            </p>
            <Wrapper onClick={openCreate}>
                POST http://localhost:3000/create
            </Wrapper>

            <p>JSON-Body:</p>

            <p>{"{\n" +
            "    \"memeId\":\"b717756bf5921681aa91b08feb1af324\",\n" +
            "    \"memes\":\n" +
            "    [\n" +
            "        {\n" +
            "        \"name\":\"nameOfMeme1\",\n" +
            "        \"desc\":\"descriptionOfMeme1\",\n" +
            "        \"texts\":[\"text1OfMeme1\",\"text2OfMeme1\"],\n" +
            "        \"xCoordinates\":[111, 222],\n" +
            "        \"yCoordinates\":[111, 222],\n" +
            "        \"fontSizes\":[11, 22],\n" +
            "        \"colors\":[\"#000000\", \"#0000FF\"]\n" +
            "        },\n" +
            "        {\n" +
            "        \"name\":\"nameOfMeme2\",\n" +
            "        \"desc\":\"descriptionOfMeme2\",\n" +
            "        \"texts\":[\"text1OfMeme2\",\"text2OfMeme2\"],\n" +
            "        \"xCoordinates\":[333, 444],\n" +
            "        \"yCoordinates\":[333, 444],\n" +
            "        \"fontSizes\":[33, 44],\n" +
            "        \"colors\":[\"#32CD32\", \"#800000\"]\n" +
            "        }\n" +
            "    ]\n" +
            "}"}</p>

            <p>
                If you click on the link, the request is executed. These images are always created
                by the API. If you want to create memes
                as a user, please log in and create a meme.
            </p>
        </>
    )
}