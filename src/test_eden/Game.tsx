import {Box} from "@mui/material";
import styled from "styled-components";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import {useResource} from "../Resource";
import {GameControls} from "./GameControls.tsx";

export const Game = () => {
  return (
    <>
    <Screen display="flex" flexDirection="row" justifyContent="space-between">
      <div style={{flex: '1 1 30%'}}></div>
      <div style={{flex: '1 1 30%'}}></div>
      <TreeTrunk/>
    </Screen>
      <GameControls />
    </>
  )
}

const TreeTrunk = () => {
  const {get} = useResource().resources
  const height = get('behemoth_climb_height')
  return (
    <Trunk>
      <Box position="absolute" bottom={100} left="50%">
        {height.value}
      </Box>
      <Behemoth />
    </Trunk>
  )
}

const Behemoth = () => {
  const {get} = useResource().resources;
  const speed = get('behemoth_climb_speed').value;
  return (
    <StyledBehemoth>
      <KeyboardArrowUpIcon />
      <KeyboardDoubleArrowUpIcon />
      {speed}
    </StyledBehemoth>
  )
}

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
