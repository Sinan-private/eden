import {useState} from "react";
import {Box} from "@mui/material";
import styled from "styled-components";
import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import image from '../../assets/images/seemless_trunk.png';
import {useAnimationSubscription} from "../../Resource";
import {Branches} from "./Branches.tsx";
import {CLIMBING_SPEED_COEFFICIENT} from "../constants/constants.ts";
import {Digging} from "./Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";

const BACKGROUND_IMAGE_HEIGHT = 600;
const BACKGROUND_IMAGE_WIDTH = 571;

export const TreeTrunk = observer(() => {
  const {get} = useGame().resources
  const climbing_speed = get('behemoth_climb_speed').value
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
      <TrunkContainer>
        <Trunk>
          <TrunkBackground $displacement={prop}/>
        </Trunk>
      </TrunkContainer>
      <Branches displacement={displacement}/>
      <Behemoth/>
      <Digging/>
    </Tree>
  )
})


const Tree = styled(Box)`
    position: relative;
    width: ${BACKGROUND_IMAGE_WIDTH}px;
    height: 100vh;
    z-index: 1;
`

const TrunkContainer = styled(Box)`
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    z-index: 1;
`
const Trunk = styled(Box)`
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
