// @ts-ignore
import {MemeType} from "../../util/typedef";
import styled from "styled-components";
import {colors} from "../layout/colors";

const CarouselWrapper = styled.div`
  display: flex;
  gap: 8px;

  border: 3px solid ${colors.background.header};
  border-radius: 4px;
  padding: 8px;
  
  overflow: auto;
`

const StyledImage = styled.img`
  height: 150px;
  margin: 0 auto;
  transition: transform 0.2s;
  &:hover{
    transform: scale(1.02);
  }
  cursor: pointer;
`

interface CarouselProps {
    memes: MemeType[],
    onCarouselSelect: (meme: MemeType) => any
}

export const Carousel = ({memes, onCarouselSelect}: CarouselProps) => {


    return (
        <CarouselWrapper>
            {memes.map(meme => <StyledImage onClick={() => onCarouselSelect(meme)} src={meme.img.base64}/>)}
        </CarouselWrapper>
    )
}