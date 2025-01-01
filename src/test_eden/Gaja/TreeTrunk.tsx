import {useMemo, useState} from "react";
import {Box} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import styled from "styled-components";
import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import image from '../../assets/images/seemless_trunk.png';
import {useAnimationSubscription} from "../../Resource";

const SPOTS_DIVIDER = 25;
const BACKGROUND_IMAGE_HEIGHT = 600;
const CLIMBING_SPEED_COEFFICIENT = 0.1

export const TreeTrunk = observer(() => {
  const {get} = useGame().resources
  const height = get('behemoth_climb_height').beautify.value
  const climbing_speed = get('behemoth_climb_speed').value
  const [displacement, setDisplacement] = useState(-BACKGROUND_IMAGE_HEIGHT*2);

  useAnimationSubscription(() => {
    if (climbing_speed) {
      const newPosition = (displacement + climbing_speed * CLIMBING_SPEED_COEFFICIENT) % BACKGROUND_IMAGE_HEIGHT
      setDisplacement(newPosition - BACKGROUND_IMAGE_HEIGHT)
    }
  })

  return (
    <Tree>
      <Behemoth/>
      <Digging/>
      <Trunk>
        <TrunkBackground $displacement={displacement} />
      </Trunk>
      <Box position="absolute" bottom={100} left="50%">
        {height}
      </Box>
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
            background: 'radial-gradient(circle, rgba(34,54,50,1) 0%, rgba(47,71,66,1) 100%)',
          }}/>
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
    }}>
      <Box sx={{
        position: 'absolute',
        width: 200,
        height: 200,
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        // border: '1px solid red',
      }}>
        {spots}
      </Box>
      <Box sx={{
        position: 'relative',
        width: digging_depth + '%',
        height: 10,
        backgroundColor: 'white',
      }}>
        <Box sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          backgroundColor: 'green',
          width: '100%',
          height: flushing_depth + '%',
        }}/>
      </Box>
    </Box>
  )
})

const Behemoth = () => {
  const {get} = useGame().resources;
  const speed = get('behemoth_climb_speed').beautify.value;
  return (
    <StyledBehemoth>
      <KeyboardArrowUpIcon/>
      <KeyboardDoubleArrowUpIcon/>
      {speed}
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
    width: 40%;
    height: 100vh;
`

const Trunk = styled(Box)`
    position: relative;
    width: 571px;
    height: 600px;
`

const TrunkBackground = styled.div.attrs<{$displacement: number}>(props => ({
  style: {
    transform: `translateY(${props.$displacement}px)`
  },
}))`position: relative;
    //top: -600px;
    width: 571px;
    height: 1800px;
    background-image: url("${image}");`


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
