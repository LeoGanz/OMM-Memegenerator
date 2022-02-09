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
        fetch('http://localhost:3000/profile' + "?" + "end=4&" + "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRkY2QuY3J1aXNlQGdteC5kZSIsImp0aSI6Ijk1NWQwMzhjLWMxMjktNGM3YS04YTJhLWY1NGU5NDAxOGMzOCIsImlhdCI6MTY0NDM5ODI0MCwiZXhwIjoxNjQ0NDAxODQwfQ.zamQrinrT29qMAwVv96JUkGe0G97YwTUHfon7-ogIcU", {
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

                <ImageGroup><SubTitle>History of Pictures</SubTitle>
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

                <CommentGroup><SubTitle>History of Comments</SubTitle>
                    {
                        ProfileData.comments?.map((comment) => {
                            console.log(comment.dateOfCreation);
                            if (comment.dateOfCreation !== undefined) {
                                return <CommentCardProfile date={comment.dateOfCreation}
                                                           src={comment.base64}
                                                           children={comment.text}/>
                            } else {
                                return <CommentCardProfile date="0000-11--22" src={comment.base64}
                                                           children={comment.text}/>
                            }
                        })}
                </CommentGroup>
            </DivGroup>
        </>
    )
}