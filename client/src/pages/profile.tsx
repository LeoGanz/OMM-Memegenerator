import {
    CommentCardProfile,
    CommentGroup, DivGroup, ImageGroup, MemeCardProfile
} from "../components/profile/page-necessities";
import {Title, SubTitle} from "../components/layout/typography"

export const Profile = () => {
    return (
        <>
            <Title>Username</Title>
            <SubTitle>FullName</SubTitle>
            <SubTitle>Email</SubTitle>
            <DivGroup>
                <ImageGroup>
                    <MemeCardProfile date="0000-11-22" src="asdfghjklö"/>
                </ImageGroup>
                <CommentGroup>
                    <CommentCardProfile date="0000-22-44" src="wuhu" children="someChildren"/>
                </CommentGroup>
            </DivGroup>
        </>
    )
}