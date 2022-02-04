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

const StyledImage = styled.img<{selected: boolean}>`
  height: 150px;
  margin: 0 auto;
  transition: transform 0.2s;
  padding-bottom: 2px;
  &:hover{
    transform: scale(1.02);
  }
  cursor: pointer;

  border-bottom: ${props => props.selected ? colors.background.header : "white"} 4px solid;
  
`

interface CarouselProps {
    memes: MemeType[],
    onCarouselSelect: (index: number) => any
    currentSelection: number |undefined
}

export const Carousel = ({memes, onCarouselSelect, currentSelection}: CarouselProps) => {


    return (
        <CarouselWrapper>
            {memes.map((meme, index) => <StyledImage selected={index === currentSelection} onClick={() => onCarouselSelect(index)} src={meme.img.base64}/>)}
        </CarouselWrapper>
    )
}