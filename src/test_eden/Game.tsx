import {Box} from "@mui/material";
import styled from "styled-components";
import {Gaja} from "./Gaja/Gaja.tsx";
import upstream_image from '../assets/images/upstream.gif';
import {useGame} from "./context/game.context.ts";
import {Background} from "./Background.tsx";
import {blue} from "../constants/colors.ts";
import {DebuggingComponents} from "./Debugging/DebuggingComponents.tsx";
import {Interface} from "./Interface/Interface.tsx";

const IMAGE_HEIGHT = 400


export const Game = () => {
  const {isActive} = useGame();
  return (
    <Screen>
      <Content
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        $paused={!isActive}
        sx={{pointerEvents: 'none'}}
      >
        <Gaja/>
      </Content>
      <Interface/>
      <Upstream/>
      <Background/>
      <DebuggingComponents/>
    </Screen>
  )
}

// type FactionButtonProps = {
//   disabled: boolean;
//   faction: FactionClass
// }


// Todo offer this as part of the Beveled component

const Screen = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`

const Content = styled(Box)<{ $paused: boolean }>`
    width: 100vw;
    height: 100vh;
    border: 2px solid transparent;
    border-color: ${props => props.$paused ? blue : 'transparent'};
    transition: border-color 0.5s ease;
    overflow: hidden;
`


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
        }}/>
        <Box sx={{
          width: '100%',
          height: 400,
          background: 'black'
        }}/>
      </UpstreamContainer>
    )
}

const UpstreamContainer = styled(Box).attrs<{ $position: number }>((props) => ({
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


// const HoverConditionally = styled(Box)<{ $disabled: boolean }>`
//     ${({ $disabled }) => !$disabled && `
//     &:hover {
//       background: #202927;
//     }
//   `}
// `