import {Title} from "../components/layout/typography";
import styled from "styled-components";

const Wrapper = styled.p`
  font-size: 1.5em;
  color: blue;
  
`

const openCreate = () => {
    window.open("http://localhost:3000/retrieve?numberOfMemes=10");
}

export const APIDoc = () => {
    return (
        <>
            <Title>
                Documentation - API
            </Title>
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

                An example request would look like this:
            </p>
            <Wrapper onClick={openCreate}>
                GET
                localhost:3000/retrieve?numberOfMemes=10&text=Hello&creatorName=someName&creationDate=2022-2-2
            </Wrapper>
            <p/>
            <p/>
            <p/>
            <p>

                If you click on the on the URL. You get to a new page giving back URLs to every meme
                found for these parameters given.
            </p>
        </>
    )
}