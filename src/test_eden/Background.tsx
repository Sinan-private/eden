import styled from "styled-components";
import background from '../assets/images/hell_background.jpg'
import './background.css';
import {useGame} from "./context/game.context.ts";

export const Background = () => {
  const {danger} = useGame().upstream
  const distort = danger;
  const distortionStrength = distort / 100;
  const hueRotation = distort * 1.95;
  const brightness = 1-distortionStrength/3
  const bloodPosition = 200 - distort * 2
  const saturate = 1 + distortionStrength / 2

  return (
    <>
      <Frame style={{filter: `brightness(${brightness}) hue-rotate(${hueRotation}deg) blur(${distort/5}px) saturate(${saturate})`}}/>
      {/*<Frame style={{filter: `grayscale(0%) brightness(0.6) hue-rotate(195deg) blur(0px) saturate(1.5)`}}/>*/}
      <Blood style={{transform: `translateY(${bloodPosition}%)`, opacity: 0.5 + distortionStrength}} />
    </>
  )
}

const Frame = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url("${background}");
    background-size: cover;
    z-index: -1;
`

const Blood = styled.div`
    position: absolute;
    pointer-events: none;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: red;
    mix-blend-mode: color;
    filter: blur(110px);
    z-index: 1;
`