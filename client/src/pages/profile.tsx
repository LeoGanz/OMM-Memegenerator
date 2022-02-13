import {
    CommentCardProfile,
    CommentGroup, DivGroup, ImageGroup, MemeCardProfile
} from "../components/profile/page-necessities";
import {Title, SubTitle} from "../components/layout/typography"
import React, {useContext, useEffect, useState} from "react";
import LoginContext from "../login-context";
import {ProfileData} from "../util/profile-data";
import {getJwt} from "../util/jwt";
import {ButtonLink, HeadlineSection} from "./overview";


export const Profile = () => {
    const {isLoggedIn} = useContext(LoginContext)

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
        if (isLoggedIn) {
            jwt = localStorage.getItem('meme-token') || "";
            fetch('http://localhost:3000/profile' + getJwt() + "&end=20",
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(r => {
                if (r.ok) {
                    r.json().then(r => {
                        setProfileData(r);
                    });
                } else {
                    window.alert("Connection to the server failed");
                }
            });
        }
    }, [isLoggedIn]);
    return (
        <>
            <HeadlineSection>
                <Title>{ProfileData.username}</Title>
                <ButtonLink to="/">Back to Overview Page</ButtonLink>
            </HeadlineSection>
            <SubTitle>{ProfileData.fullName}</SubTitle>
            <SubTitle>{ProfileData.email}</SubTitle>
            <DivGroup>

                <ImageGroup><SubTitle>History of Pictures</SubTitle>
                    {
                        ProfileData.memeHistory?.map((meme) => {
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