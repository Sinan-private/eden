import {Box} from "@mui/material";
import styled from "styled-components";
import {Gaja} from "./Gaja/Gaja.tsx";
import upstream_image from '../assets/images/upstream.gif';
import {Background} from "./Background.tsx";
import {DebuggingComponents} from "./Debugging/DebuggingComponents.tsx";
import {Interface} from "./Interface/Interface.tsx";
import {game} from "@/test_eden/Classes/Game/createSingletonGame.ts";
import {observer} from "mobx-react";
import {GameClass} from "@/test_eden/Classes/Game/GameClass.ts";

const IMAGE_HEIGHT = 400

declare global {
  interface Window {
    game: GameClass;
  }
}

export const Game = () => {
  window.game = game();
  // Test trade
  // game.resources.trade([{key: 'dirty_mana_level_1', value: 1}], [{key: 'raw_mana_level_1', value: 1}], 0.2).tradeIfPossible()
  return (
    <Screen id="Game" className="font-geist-sans text-sm antialiased">
      <Background/>
      <Gaja/>
      <Upstream/>
      <Interface/>
      <DebuggingComponents/>
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

const Upstream = observer(() => {
  const {upstream, behemoth} = game();
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
})

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
    z-index: 100;
`


// const HoverConditionally = styled(Box)<{ $disabled: boolean }>`
//     ${({ $disabled }) => !$disabled && `
//     &:hover {
//       background: #202927;
//     }
//   `}
// `