import {useGame} from "../context/game.context.ts";
import {useTick} from "../../Resource/context/tick.context.ts";
import behemoth_animated from "../../assets/images/Behemoth_animated.gif";
import behemoth_image from "../../assets/images/Behemoth.png";
import styled from "styled-components";

export const Behemoth = () => {
  const {get} = useGame().resources;
  const {isActive} = useTick();
  const speed = get('behemoth_climb_speed').value;
  const src = speed && isActive ? behemoth_animated : behemoth_image;
  return (
    <StyledBehemoth>
      <img src={src} alt={src} style={{transform: 'rotate(-90deg)'}}/>
    </StyledBehemoth>
  )
}
const StyledBehemoth = styled('div')`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: -20px;
    transform: translateY(-50%);
    width: 40px;
    height: 100px;
    background: #66756f;
    z-index: 10;
`