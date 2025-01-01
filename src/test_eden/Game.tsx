import {Box, Divider, Paper, Typography} from "@mui/material";
import styled from "styled-components";
import {GameControls} from "./GameControls.tsx";
import {TickControl} from "./TickControl.tsx";
import {useGame} from "./context/game.context.ts";
import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug} from "./Components/Debug.tsx";
import {SlaveCount} from "./SlaveCount.tsx";
import {FactionManager} from "./FactionManager.tsx";
import {TreeTrunk} from "./Gaja/TreeTrunk.tsx";
import background from '../assets/images/hell_background.jpg'
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";


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
      <Box sx={{position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)'}}>
        <Debug_SlaveManagement/>
      </Box>
      <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)'}}>
        <FactionManager/>
      </Box>
    </>
  )
}

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
        {getByType('mana').map(({id, beautify, icon, value}) => (
          <Box key={id}>
            <img src={icon} alt={icon} style={value < 1 ? inactiveStyle : {}} />
            <Typography>{beautify.value}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  )
}

const Screen = styled(Box)`
    width: 100vw;
    height: 100vh;
    //background: #151918;
    background-image: url("${background}");
    background-size: cover;
`
