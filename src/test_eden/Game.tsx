import {Box, Typography} from "@mui/material";
import styled from "styled-components";
import {Debug_BehemothControls} from "./Debugging/Debug_BehemothControls.tsx";
import {FactionManager} from "./FactionManager.tsx";
import {TreeTrunk} from "./Gaja/TreeTrunk.tsx";
import {TopBar} from "./TopBar.tsx";
import upstream_image from '../assets/images/upstream.gif';
import {useGame} from "./context/game.context.ts";
import {Background} from "./Background.tsx";
import {blue} from "../constants/colors.ts";
import {observer} from "mobx-react";
import {DebuggingComponents} from "./Debugging/DebuggingComponents.tsx";
import chains from '../assets/images/chains.png'

const IMAGE_HEIGHT = 400


export const Game = () => {
  const {isActive} = useGame();
  return (
    <Screen>
      <Content display="flex" flexDirection="row" justifyContent="space-between" $paused={!isActive}>
        <div style={{flex: '1 1 30%', pointerEvents: 'none'}}></div>
        <div style={{flex: '1 1 30%', pointerEvents: 'none'}}></div>
        <TreeTrunk/>
      </Content>
      <Debug_BehemothControls/>
      <TopBar/>
      <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)'}}>
        <FactionManager/>
      </Box>
      <Box sx={{position: 'absolute', bottom: 50, right: 50, zIndex: 1}}>
        <SlaveManager/>
      </Box>
      <Upstream/>
      <Background/>
      <DebuggingComponents/>
    </Screen>
  )
}

const SlaveManager = observer(() => {
  const SIZE = 280
  const {slaves, factions} = useGame();
  const slaveHunterImage = factions.factionMarid.image;
  const demonsImage = factions.factionIfrit.image;
  const guardsImage = factions.factionGhoul.image;
  const mindBendersImage = factions.factionArwa.image;
  const {unassigned_slaves, addToFaction, arwa, marid} = slaves;
  return (
    <Box position="relative" sx={{width: SIZE, height: SIZE}}>
      <SlaveTop>
        <FullSizedImage src={demonsImage} $disabled $inactive/>
      </SlaveTop>
      <SlaveLeft>
        <FullSizedImage src={guardsImage} $disabled $inactive/>
      </SlaveLeft>
      <SlaveRight onClick={() => addToFaction('marid')}>
        <FullSizedImage src={slaveHunterImage} $disabled={!slaves.unassigned_slaves}/>
        <Typography>{marid}</Typography>

        {/*<FactionButton faction={factions.slaveHunters}/>*/}
      </SlaveRight>
      <SlaveBottom onClick={() => addToFaction('arwa')}>
        <FullSizedImage src={mindBendersImage} $disabled={!slaves.unassigned_slaves}/>
        <Typography>{arwa}</Typography>
      </SlaveBottom>
      <SlaveCenter>
        <FullSizedImage src={chains}/>
        <Typography fontSize="2rem" lineHeight="2.7rem">{unassigned_slaves}</Typography>
        {/*<Typography fontSize={10} px={2}>Unassigned slaves</Typography>*/}
      </SlaveCenter>
      <Shadow size={SIZE} x={3} y={3} color="#3f675e" blur={0} opacity={0.15}/>
    </Box>
  )
})

// type FactionButtonProps = {
//   disabled: boolean;
//   faction: FactionClass
// }


const FullSizedImage = styled.img<{ $disabled?: boolean; $inactive?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${props => props.$inactive ? 0.2 : 1};
    filter: ${props => props.$inactive
            ? 'saturate(0.2) blur(0px) brightness(0.6) contrast(1.4)'
            : props.$disabled
                    ? 'saturate(0.5) blur(0.5px) brightness(0.6) contrast(0.6)'
                    : 'none'};
    transition: all 1.2s ease;
    z-index: -1;
`;

type ShadowProps = {
  size: number;
  x: number;
  y: number;
  color?: string;
  opacity?: number;
  blur?: number;
}

// Todo offer this as part of the Beveled component

const Shadow = (
  {
    size,
    x,
    y,
    color = "black",
    opacity = 0.3,
    blur = 2,
  }: ShadowProps) => (
  <Box position="absolute" sx={{
    width: size,
    height: size,
    top: y,
    left: x,
    opacity,
    filter: `blur(${blur}px)`,
    zIndex: -1,
  }}>
    <SlaveTop $disabled $backgroundColor={color}/>
    <SlaveLeft $disabled $backgroundColor={color}/>
    <SlaveRight $disabled $backgroundColor={color}/>
    <SlaveBottom $disabled $backgroundColor={color}/>
    <SlaveCenter $disabled $backgroundColor={color}/>
  </Box>
)

const SlaveAssignmentBase = styled.div<{ $disabled?: boolean, $backgroundColor?: string }>`
    position: absolute;
    width: 31%;
    height: 31%;
    cursor: ${props => props.$disabled ? 'initial' : 'pointer'};
    Top: auto;
    bottom: auto;
    right: auto;
    left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    background-color: ${props => props.$backgroundColor || '#151918'};
    transition: background-color 1.8s ease;
    clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);

    z-index: 2000;

`;

const SlaveTop = styled(SlaveAssignmentBase)`
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    //clip-path: polygon(0% 0, 100% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);
`;
const SlaveLeft = styled(SlaveAssignmentBase)`
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    //clip-path: polygon(0% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 100%);
`;

const SlaveRight = styled(SlaveAssignmentBase)`
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    //clip-path: polygon(15% 0%, 100% 0, 100% 15%, 100% 85%, 100% 100%, 15% 100%, 0 85%, 0% 15%);
`;

const SlaveBottom = styled(SlaveAssignmentBase)`
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    //clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 100% 100%, 0% 100%, 0 85%, 0 15%);
`;

const SlaveCenter = styled(SlaveAssignmentBase)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);
`

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