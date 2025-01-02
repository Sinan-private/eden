import {Box} from "@mui/material";
import styled from "styled-components";
import {Debug_BehemothControls} from "./Debugging/Debug_BehemothControls.tsx";
import {Debug_Behemoth} from "./Debugging/Debug_Behemoth.tsx";
import {Debug} from "./Components/Debug.tsx";
import {FactionManager} from "./FactionManager.tsx";
import {TreeTrunk} from "./Gaja/TreeTrunk.tsx";
import background from '../assets/images/hell_background.jpg'
import {Debug_SlaveManagement} from "./Debugging/Debug_SlaveManagement.tsx";
import {TopBar} from "./TopBar.tsx";
import upstream_image from '../assets/images/upstream.gif';
import {useGame} from "./context/game.context.ts";


export const Game = () => {
  const game = useGame();
  window.game = game;
  console.log(game.isActive)
  return (
    <>
      <Screen display="flex" flexDirection="row" justifyContent="space-between" $paused={!game.isActive}>
        <div style={{flex: '1 1 30%'}}></div>
        <div style={{flex: '1 1 30%'}}></div>
        <TreeTrunk/>
      </Screen>
      <Debug_BehemothControls/>
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
      <Upstream/>
    </>
  )
}

const Screen = styled(Box)<{$paused: boolean}>`
    width: 100vw;
    height: 100vh;
    //background: #151918;
    background-image: url("${background}");
    background-size: cover;
    border: 2px solid;
    border-color: ${props => props.$paused ? 'red' : 'transparent'};
    transition: border-color 0.5s ease;
`

const Upstream = () => {
  const {upstream, behemoth} = useGame();
  const IMAGE_HEIGHT = 400
  const position = IMAGE_HEIGHT - (behemoth.climb_height.value - upstream.height.value);
  return position < -300
    ? null
    : (
      <Box sx={{
        // border: '1px solid red',
        pointerEvents: 'none',
        width: '100%',
        height: 600,
        position: 'fixed',
        // bottom: 0,
        bottom: -400 + position,
        left: 0,
        zIndex: 1,
      }}>
        <Box sx={{
          width: '100%',
          height: 200,
          position: 'relative',
          left: 0,
          zIndex: 1,
          backgroundImage: `url(${upstream_image})`,
          backgroundPosition: '0 280px',
        }} />
        <Box sx={{
          width: '100%',
          height: 400,
          background: 'black'
        }}/>
      </Box>
    )
}