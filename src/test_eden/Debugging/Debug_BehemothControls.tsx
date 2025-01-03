import {Button, Divider, Stack} from "@mui/material";
import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {observer} from "mobx-react";
import {useTick} from "../../Resource/context/tick.context.ts";
import {useEffect} from "react";

export const Debug_BehemothControls = observer(() => {
  const {behemoth} = useGame();
  const {isActive} = useTick();
  const onToggleClimbing = behemoth.movement_requested ? behemoth.stopClimbing : behemoth.startClimbing
  const onToggleDigging = behemoth.digging_requested ? behemoth.stopDigging : behemoth.startDigging
  const onToggleFlushing = behemoth.flushing_requested ? behemoth.stopFlushing : behemoth.startFlushing

  useEffect(() => {
    if (!behemoth.can_flush) {
      behemoth.stopFlushing()
    }
  }, [behemoth]);

  return (
    <StyledGameControls>
      <Stack direction="row">
        <Button disabled={!behemoth.movement_requested && !behemoth.can_start_climbing} onClick={onToggleClimbing} color={isActive ? undefined : 'error'}>
          {behemoth.movement_requested ? 'Stop climbing' : 'Start climbing'}
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button disabled={!behemoth.can_dig} onClick={onToggleDigging} color={isActive ? undefined : 'error'}>
          {behemoth.digging_requested ? 'Stop digging' : 'Start digging'}
        </Button>
        <Button disabled={!behemoth.can_flush} onClick={onToggleFlushing} color={isActive ? undefined : 'error'}>
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
    z-index: 100;
`