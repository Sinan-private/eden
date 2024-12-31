import {Box, Button, CircularProgress, CircularProgressProps, Divider, Paper, Stack, Typography} from "@mui/material";
import styled from "styled-components";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {GameControls} from "./GameControls.tsx";
import {TickControl} from "./TickControl.tsx";
import {observer} from "mobx-react";
import {useGame} from "./context/game.context.ts";
import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {useMemo} from "react";
import {Debug} from "./Components/Debug.tsx";
import {SlaveCount} from "./SlaveCount.tsx";

const SPOTS_DIVIDER = 75;

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
      <TopBar/>
      <Debug>
        <Box sx={{position: 'absolute', bottom: 50, left: 10}}>
          <Debug_Behemoth/>
        </Box>
      </Debug>
      <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)'}}>
        <SlaveManager/>
      </Box>
    </>
  )
}

const SlaveManager = observer(() => {
  const {slaves} = useGame();
  return (
    <Box>
      <Typography variant="h5" mb={2} onClick={() => slaves.addSlave()}>Slaves</Typography>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.wasteSlave()}>-</Button>
        <SlaveCount />
        <Button onClick={() => slaves.addSlave()}>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button disabled>-</Button>
        <Typography>Unassigned {slaves.slave_unassigned}</Typography>
        <Button disabled>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.unassignSlaves('digger', 1)}>-</Button>
        <Typography>Diggers {slaves.slave_diggers}</Typography>
        <Button onClick={() => slaves.assignSlaves('digger', 1)}>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.unassignSlaves('blacksmith', 1)}>-</Button>
        <Typography>Blacksmiths {slaves.slave_blacksmiths}</Typography>
        <Button onClick={() => slaves.assignSlaves('blacksmith', 1)}>+</Button>
      </Stack>
      <Button onClick={() => slaves.wasteSlave()}>Test</Button>
    </Box>
  )
})

const TopBar = () => {
  const {resources, behemoth} = useGame();
  const {getByType} = resources;
  const inactiveStyle = {filter: 'saturate(0) brightness(0.3) contrast(0.9)'}
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      <Paper sx={{display: 'flex', gap: 2, py: 2, px: 3}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}} mr={2}>
          <SlaveCount />
          <Typography variant="body2" mt={1}>Slaves</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box mr={4}>
          <Typography variant="caption">Raw</Typography>
          <Typography>{behemoth.raw_mana}</Typography>
        </Box>
        {getByType('mana').map(({id, beautify, icon, value}, i) => (
          <Box key={id}>
            <img src={icon} alt={icon} style={value < 1 ? inactiveStyle : {}} />
            <Typography>{beautify.value}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
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


const getRandomCoordinateList = (max: number) => {
  return Array.from(Array(max).keys()).map(() => {
    const [x, y, size] = getRandomCoordinates(max);
    return [x, y, size]
  })
}

const getRandomCoordinates = (max: number) => {
  const rand = (divider = 2) => {
    const multiplier = Math.random() > 0.5 ? 1 : -1;
    return (max / 2) + Math.random() * (max / divider) * multiplier;
  }
  return [rand(), rand(4), Math.random() * 3 + 0.5];
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
