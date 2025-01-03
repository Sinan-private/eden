import styled from "styled-components";
import background from '../assets/images/hell_background.jpg'
import './background.css';
import {useGame} from "./context/game.context.ts";

export const Background = () => {
  const {danger} = useGame().upstream
  const distort = danger;
  const distortionStrength = distort / 100;
  const hueRotation = distort * 1.95;
  const grayscale = distort >= 50 ? distort - 50 : 0;
  const brightness = 1-distortionStrength/3
  const bloodPosition = 200 - distort * 2
  const saturate = 1 + distortionStrength / 2

  return (
    <>
      <Frame style={{filter: `brightness(${brightness}) hue-rotate(${hueRotation}deg) blur(${distort/5}px)`}}/>
      {/*<Frame style={{filter: `grayscale(0%) brightness(0.6) hue-rotate(195deg) blur(0px) saturate(1.5)`}}/>*/}
      <Blood style={{transform: `translateY(${bloodPosition}%)`, opacity: 0.5 + distortionStrength}} />
    </>
  )
}

const Disortion = () => {
  return (
    <>
      <svg className="filter">
        <filter id="alphaRed">
          <feColorMatrix mode="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="joint"/>
        </filter>
        <filter id="alphaGreen">
          <feColorMatrix mode="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="joint"/>
        </filter>
        <filter id="alphaBlue">
          <feColorMatrix mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="joint"/>
        </filter>
        <filter id="alpha">
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </svg>
      <div className="page">
        <div className="imgWrap">
          <img className="red" src={background}/>
          <img className="green" src={background}/>
          <img className="blue" src={background}/>
        </div>
      </div>
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