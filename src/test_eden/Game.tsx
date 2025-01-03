import {Box} from "@mui/material";
import styled from "styled-components";
import {Debug_BehemothControls} from "./Debugging/Debug_BehemothControls.tsx";
import {Debug_Behemoth} from "./Debugging/Debug_Behemoth.tsx";
import {Debug} from "./Components/Debug.tsx";
import {FactionManager} from "./FactionManager.tsx";
import {TreeTrunk} from "./Gaja/TreeTrunk.tsx";
import {Debug_SlaveManagement} from "./Debugging/Debug_SlaveManagement.tsx";
import {TopBar} from "./TopBar.tsx";
import upstream_image from '../assets/images/upstream.gif';
import {useGame} from "./context/game.context.ts";
import {Background} from "./Background.tsx";
import {blue} from "../constants/colors.ts";

export const Game = () => {
  const game = useGame();
  return (
    <Screen>
      <Content display="flex" flexDirection="row" justifyContent="space-between" $paused={!game.isActive}>
        <div style={{flex: '1 1 30%'}}></div>
        <div style={{flex: '1 1 30%'}}></div>
        <TreeTrunk/>
      </Content>
      <Debug_BehemothControls/>
      <TopBar/>
      <Debug>
        <Box sx={{position: 'absolute', bottom: 50, left: 10}}>
          <Debug_Behemoth/>
        </Box>
      </Debug>
      <Box sx={{position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', zIndex: 1}}>
        <Debug_SlaveManagement/>
      </Box>
      <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)'}}>
        <FactionManager/>
      </Box>
      <Upstream/>
      <Background />
    </Screen>
  )
}



const Screen = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`

const Content = styled(Box)<{$paused: boolean}>`
    width: 100vw;
    height: 100vh;
    border: 2px solid;
    border-color: ${props => props.$paused ? blue : 'transparent'};
    transition: border-color 0.5s ease;
    overflow: hidden;
`

  const IMAGE_HEIGHT = 400
const Upstream = () => {
  const {upstream, behemoth} = useGame();
  const position = IMAGE_HEIGHT - (behemoth.climb_height.value - upstream.height.value);
  return position < -300
    ? null
    : (
      <UpstreamContainer $position={position}>
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
      </UpstreamContainer>
    )
}

const UpstreamContainer = styled(Box).attrs<{$position: number}>((props) => ({
  style: {
    bottom: -400 + props.$position,
  }
}))`
    pointer-events: none;
    width: 100%;
    height: 600px;
    position: fixed;
    left: 0;
    z-index: 1;
`