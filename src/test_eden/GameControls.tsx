import {Button, Divider, Stack} from "@mui/material";
import styled from "styled-components";
import {useGame} from "./context/game.context.ts";
import {observer} from "mobx-react";

export const GameControls = observer(() => {
  const {behemoth} = useGame();
  const onToggleClimbing = behemoth.movement_requested ? behemoth.stopClimbing : behemoth.startClimbing
  const onToggleDigging = behemoth.digging_requested ? behemoth.stopDigging : behemoth.startDigging
  const onToggleFlushing = behemoth.flushing_requested ? behemoth.stopFlushing : behemoth.startFlushing

  return (
    <StyledGameControls>
      <Stack direction="row">
        <Button disabled={!behemoth.canClimb} onClick={onToggleClimbing}>
          {behemoth.movement_requested ? 'Stop climbing' : 'Start climbing'}
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button disabled={!behemoth.canDig} onClick={onToggleDigging}>
          {behemoth.digging_requested ? 'Stop digging' : 'Start digging'}
        </Button>
        <Button disabled={!behemoth.canFlush} onClick={onToggleFlushing}>
          {behemoth.flushing_requested ? 'Stop flushing' : 'Start flushing'}
        </Button>
      </Stack>
    </StyledGameControls>
  )
})

const StyledGameControls = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    //border: 1px solid red;
    padding: 8px 12px;
`