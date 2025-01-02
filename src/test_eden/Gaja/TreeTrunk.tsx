import {useMemo, useState} from "react";
import {Box} from "@mui/material";
import styled from "styled-components";
import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import image from '../../assets/images/seemless_trunk.png';
import {useAnimationSubscription} from "../../Resource";
import behemoth_image from '../../assets/images/behemoth.png';
import behemoth_animated from '../../assets/images/behemoth_animated.gif';
import mana_dirty from '../../Resource/assets/icons/mana_dirty.png';
import {useTick} from "../../Resource/context/tick.context.ts";
import {Branches} from "./Branches.tsx";
import {CLIMBING_SPEED_COEFFICIENT} from "../constants/constants.ts";


const SPOTS_DIVIDER = 25;
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
      {/*<Branch src={branch_image} $displacement={0} />*/}
      <Behemoth/>
      <Digging/>
    </Tree>
  )
})



const Digging = observer(() => {
  const {behemoth} = useGame()
  const {digging_depth, flushing_depth, dirty_mana} = behemoth
  const spots = useMemo(() => {
    const amount = Math.floor(dirty_mana / SPOTS_DIVIDER);
    const spotList = Array.from(Array(amount).keys()).map(key => {
      const index = key % 100;
      const [x, y, size] = randomCoordinates[index];
      return [key, x, y, size]
    })
    return (
      <>
        {spotList.map(([i, x, y, size]) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: 20 * size,
            height: 20 * size,
            top: y,
            left: x,
            borderRadius: 20,
            // background: 'radial-gradient(circle, rgba(34,54,50,1) 0%, rgba(47,71,66,1) 100%)',
          }}>
            <img src={mana_dirty} alt="dirty mana found" width={32 * size / 3} style={{opacity: 0.7}}/>
          </Box>
        ))}
      </>
    )
  }, [dirty_mana])

  return (
    <Box sx={{
      position: 'absolute',
      left: 0,
      top: '50%',
      width: '100%',
      transform: 'translateY(-50%)',
    }}>
      <Box sx={{
        position: 'absolute',
        width: 200,
        height: 200,
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
      }}>
        {spots}
      </Box>

      <Tunnel $digging_depth={digging_depth}>

        <Acid $flushing_depth={flushing_depth}/>
      </Tunnel>

    </Box>
  )
})

const Behemoth = () => {
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


const getRandomCoordinates = (max: number) => {
  const rand = (divider = 2) => {
    const multiplier = Math.random() > 0.5 ? 1 : -1;
    return (max / 2) + Math.random() * (max / divider) * multiplier;
  }
  return [rand(), rand(4), Math.random() * 3 + 0.5];
}

const getRandomCoordinateList = (max: number) => {
  return Array.from(Array(max).keys()).map(() => {
    const [x, y, size] = getRandomCoordinates(max);
    return [x, y, size]
  })
}

const randomCoordinates = getRandomCoordinateList(200);


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

const Tunnel = styled.div.attrs<{ $digging_depth: number }>(props => ({
  style: {
    width: props.$digging_depth + '%',
  },
}))`position: relative;
    height: 50px;
    background-Color: #000000b3;
    transition: width 0.3s linear`

const Acid = styled.div.attrs<{ $flushing_depth: number }>(props => ({
  style: {
    height: props.$flushing_depth + '%'
  },
}))`position: absolute;
    left: 0;
    bottom: 0;
    background-color: green;
    width: 100%;`


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
    z-index: 1;
`
