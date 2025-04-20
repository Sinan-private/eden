import {useState} from "react";
import styled from "styled-components";
import image from '../../assets/images/seemless_trunk.png';
import {useAnimationSubscription} from "../../Resource";
import {Branches} from "./Branches.tsx";
import {CLIMBING_SPEED_COEFFICIENT} from "../constants/constants.ts";
import {Digging} from "./Digging/Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";
import {game} from "@/test_eden/context/createSingletonGame.ts";

const BACKGROUND_IMAGE_HEIGHT = 600;
const BACKGROUND_IMAGE_WIDTH = 571;

export const Gaja = () => {
  const {getByKey} = game().resources
  const climbing_speed = getByKey('behemoth_climb_speed').value
  const [displacement, setDisplacement] = useState(0);
  useAnimationSubscription(() => {
    if (climbing_speed) {
      const newPosition = (displacement + climbing_speed * CLIMBING_SPEED_COEFFICIENT)
      setDisplacement(newPosition)
    }
  })
  const trunkDisplacement = displacement - BACKGROUND_IMAGE_HEIGHT * 3
  const prop = (trunkDisplacement % BACKGROUND_IMAGE_HEIGHT) - BACKGROUND_IMAGE_HEIGHT

  return (
    <Tree>
      <Trunk>
        <TrunkBackground $displacement={prop}/>
      </Trunk>
      <Branches displacement={displacement}/>
      <Behemoth/>
      <Digging/>
    </Tree>
  )
}


const Tree = styled('div')`
    position: fixed;
    top: 0;
    right: 0;
    width: ${BACKGROUND_IMAGE_WIDTH}px;
    height: 100vh;
    z-index: 1;
    @media only screen and (max-width: 1200px) {
        width: ${BACKGROUND_IMAGE_WIDTH * 0.8}px;
    }
    @media only screen and (max-width: 992px) {
        width: ${BACKGROUND_IMAGE_WIDTH * 0.6}px;
    }
    @media only screen and (max-width: 768px) {
        width: ${BACKGROUND_IMAGE_WIDTH * 0.3}px;
    }
`

const Trunk = styled('div')`
    position: relative;
    width: 100%;
    height: 600px;
`

const TrunkBackground = styled.div.attrs<{ $displacement: number }>(props => ({
  style: {
    transform: `translateY(${props.$displacement}px)`
  },
}))`position: relative;
    width: ${BACKGROUND_IMAGE_WIDTH}px;
    height: 3000px;
    background-image: url("${image}");`
