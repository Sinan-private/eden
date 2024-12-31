import {Box} from "@mui/material";
import styled from "styled-components";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {GameControls} from "./GameControls.tsx";
import {TickControl} from "./TickControl.tsx";
import {observer} from "mobx-react";
import {useGame} from "./context/game.context.ts";
import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {useMemo} from "react";

export const Game = () => {
  return (
    <>
      <Screen display="flex" flexDirection="row" justifyContent="space-between">
        <div style={{flex: '1 1 30%'}}></div>
        <div style={{flex: '1 1 30%'}}></div>
        <TreeTrunk/>
      </Screen>
      <GameControls/>
      <TickControl/>
      <Box sx={{position: 'absolute', bottom: 50, left: 10}}>
        <Debug_Behemoth/>
      </Box>

    </>
  )
}

const TreeTrunk = observer(() => {
  const {get} = useGame().resources
  const height = get('behemoth_climb_height').beautify.value
  return (
    <Trunk>
      <Box position="absolute" bottom={100} left="50%">
        {height}
      </Box>
      <Behemoth/>
      <Digging/>
    </Trunk>
  )
})


const Digging = observer(() => {
  const {behemoth} = useGame()
  const {digging_depth, flushing_depth, dirty_mana} = behemoth
  const spots = useMemo(() => {
    const amount = Math.floor(dirty_mana / 25);
    const spotList = Array.from(Array(amount).keys()).map(key => {
      const index = key % 100;
      const [x, y] = randomCoordinates[index];
      return [key, x, y]
    })
    return (
      <>
        {spotList.map(([i, x, y]) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: 20,
            height: 20,
            top: y,
            left: x,
            borderRadius: 20,
            backgroundColor: 'brown',
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
      <Box>{behemoth.raw_mana}</Box>
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


const getRandomCoordinateList = (max: number) => {
  return Array.from(Array(max).keys()).map(key => {
    const [x, y] = getRandomCoordinates(max);
    return [x, y]
  })
}

const getRandomCoordinates = (max: number) => {
  const rand = () => {
    const multiplier = Math.random() > 0.5 ? 1 : -1;
    return (max / 2) + Math.random() * (max / 2) * multiplier;
  }
  return [rand(), rand()];
}
const randomCoordinates = getRandomCoordinateList(200);

const Screen = styled(Box)`
    width: 100vw;
    height: 100vh;
    background: #151918;
`

const Trunk = styled(Box)`
    position: relative;
    width: 40%;
    height: 100vh;
    background: rgb(50, 41, 31);
    background: linear-gradient(90deg, rgba(50, 41, 31, 1) 0%, rgba(152, 90, 16, 1) 100%);
`

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
