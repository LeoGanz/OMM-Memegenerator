import {
    CommentCardProfile,
    CommentGroup, DivGroup, ImageGroup, MemeCardProfile
} from "../components/profile/page-necessities";
import {Title, SubTitle} from "../components/layout/typography"
import {useContext, useEffect, useState} from "react";
import LoginContext from "../login-context";
import {useNavigate} from "react-router-dom";
import {ProfileData} from "../util/profile-data";
import {getJwt} from "../util/jwt";


export const Profile = () => {
    const {isLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    let jwt = "";
    const [ProfileData, setProfileData] = useState<ProfileData>({
        comments: [],
        email: "",
        fullName: "",
        memeHistory: [],
        username: ""
    });
    if (isLoggedIn) {
        jwt = localStorage.getItem('meme-token') || "";
    }
    useEffect(() => {
        jwt = localStorage.getItem('meme-token') || "";
        fetch('http://localhost:3000/profile' + "?" + "end=4&" +
            "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRkY2QuY3J1aXNlQGdteC5kZSIsImp0aSI6ImY3NmU5YTQwLTkyMTctNDgzZC1iYjJkLTkyNGE1MTdkM2RlNiIsImlhdCI6MTY0NDQwMjQ4MiwiZXhwIjoxNjQ0NDA2MDgyfQ.yCAByQ6HnrdHV4Dpd6U9gwP8uaVydTGB3ulpy7Clczs", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(r => r.json()).then(r => {
            setProfileData(r);
            console.log(r);
        });
    }, []);
    return (
        <>
            <Title>{ProfileData.username}</Title>
            <SubTitle>{ProfileData.fullName}</SubTitle>
            <SubTitle>{ProfileData.email}</SubTitle>
            <DivGroup>

                <ImageGroup><SubTitle>History of Pictures</SubTitle>
                    {
                        ProfileData.memeHistory?.map((meme) => {
                            console.log(meme.dateOfCreation);
                            if (meme.dateOfCreation !== undefined && meme.memeId !== undefined) {
                                return <MemeCardProfile date={meme.dateOfCreation}
                                                        src={meme.img.base64} memeId={meme.memeId}/>
                            } else {
                                return <MemeCardProfile date="0000-11--22" src={meme.img.base64}
                                                        memeId={""}/>
                            }
                        })}
                </ImageGroup>

                <CommentGroup><SubTitle>History of Comments</SubTitle>
                    {
                        ProfileData.comments?.map((comment) => {
                            if (comment.dateOfCreation !== undefined) {
                                return <CommentCardProfile date={comment.dateOfCreation}
                                                           src={comment.base64}
                                                           children={comment.text}
                                                           memeId={comment.memeId}/>
                            } else {
                                return <CommentCardProfile date="0000-11--22" src={comment.base64}
                                                           children={comment.text}
                                                           memeId={comment.memeId}/>
                            }
                        })}
                </CommentGroup>
            </DivGroup>
        </>
    )
}