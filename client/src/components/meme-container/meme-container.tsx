import React from 'react';
import styled from "styled-components";
import {colors} from "../layout/colors";
import {MemeInfos} from "../meme-infos/meme-infos";
import {up} from "../../util/breakpoint";
import {Title} from "../layout/typography";
import {SingleMemeType} from "../../util/typedef";
import {NavigationButton} from "../../pages/editor";
import {useNavigate} from "react-router-dom";
import {objectToQuery} from "../../util/jwt";
import {ActionArea} from "../action-field/ActionArea";

const MemeContainerWrapper = styled.div`

  background-color: ${colors.background.memeCard.default};
  border-bottom: 1px solid ${colors.background.memeCard.default};
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 15px;
  margin: 0 -15px;

  ${up('md')} {
    padding: 0 150px 15px;
    margin: 0;
  }
`
const Meme = styled.img`
  width: 100%;
  max-width: 1000px;
  margin-bottom: 15px;
`

const StyledMemeInfos = styled(MemeInfos)`
  margin-bottom: 30px;
`

const StyledTitle = styled(Title)`
  align-self: flex-start;
  margin-bottom: 4px;
`

const Description = styled.p`
  align-self: flex-start;
  margin-bottom: 20px;
`
const MemeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`


export const MemeContainer = ({searchParams,
                                  dataUrl,
                                  comments, name, desc, next, prev,
                                  ...props
                              }: SingleMemeType & {searchParams: any}) => {
    let navigate = useNavigate()
    const handleNavigation = (isNext: boolean) => {
        const status = searchParams.get("status")
        const start = searchParams.get("start")
        const end = searchParams.get("end")
        const filterBy = searchParams.get("filterBy")
        const sortBy = searchParams.get("sortBy")
        let options = ""

        if(status || start || end || filterBy || sortBy){
            options = "?" + objectToQuery({status, start, end, filterBy, sortBy}).slice(1)
        }

        const memeId = isNext ? next : prev

        navigate('/details/' + memeId + options)
    }

    return (
        <MemeContainerWrapper>
            <StyledTitle>{name}</StyledTitle>
            <Description>{desc}</Description>
            <MemeWrapper>
                <NavigationButton onClick={() => handleNavigation(false)}>{"<"}</NavigationButton>
                <Meme src={dataUrl}/>
                <NavigationButton onClick={() => handleNavigation(true)}>{">"}</NavigationButton>
            </MemeWrapper>
            <ActionArea memeId={props.memeId} gap={searchParams.get("autoplay")}
                 currentAddress={window.location.href} next={handleNavigation}/>
            <StyledMemeInfos setVoteHoverActive={(b => {
            })} comments={comments.length} {...props}/>
        </MemeContainerWrapper>
    )
}