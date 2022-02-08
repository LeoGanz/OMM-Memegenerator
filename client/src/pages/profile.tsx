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
        fetch('http://localhost:3000/profile' + "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRkY2QuY3J1aXNlQGdteC5kZSIsImp0aSI6IjRiZGY1MWFmLTVjOTctNDE5Ni05YzhlLTIwMDA2ZjgxMTlkNiIsImlhdCI6MTY0NDMzODY3MywiZXhwIjoxNjQ0MzQyMjczfQ.OCCNCzTULibZxYheBXtqm9hZxkz-le9HZ1mXGMCrCpM", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(r => r.json()).then(r => {
            setProfileData(r);
            console.log(r);
        });
    }, []);
    if (ProfileData.memeHistory !== undefined) {
        console.log(ProfileData.memeHistory[0]);
    } else {
        console.log("undefined history")
    }
    return (
        <>
            <Title>{ProfileData.username}</Title>
            <SubTitle>{ProfileData.fullName}</SubTitle>
            <SubTitle>{ProfileData.email}</SubTitle>
            <DivGroup>
                <ImageGroup>
                    {
                        ProfileData.memeHistory?.map((meme) => {
                            console.log(meme.dateOfCreation);
                            if (meme.dateOfCreation !== undefined) {
                                return <MemeCardProfile date={meme.dateOfCreation}
                                                        src={meme.img.base64}/>
                            } else {
                                return <MemeCardProfile date="0000-11--22" src={meme.img.base64}/>
                            }
                        })}
                </ImageGroup>
                <CommentGroup>
                    {/*{*/}
                    {/*    ProfileData.comments?.map((comment) => {*/}
                    {/*        console.log(comment.dateOfCreation);*/}
                    {/*        if (comment.dateOfCreation !== undefined) {*/}
                    {/*            return <CommentCardProfile date={comment.dateOfCreation}*/}
                    {/*                                    src={comment.img.base64} children={comment.text}/>*/}
                    {/*        } else {*/}
                    {/*            return <MemeCardProfile date="0000-11--22" src={comment.img.base64}/>*/}
                    {/*        }*/}
                    {/*    })}*/}
                </CommentGroup>
            </DivGroup>
        </>
    )
}