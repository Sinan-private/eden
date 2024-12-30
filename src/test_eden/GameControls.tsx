import {Button, Divider, Stack} from "@mui/material";
import styled from "styled-components";
import {useGame} from "./context/game.context.ts";
import {observer} from "mobx-react";

export const GameControls = observer(() => {
  const {behemoth} = useGame();
  const onToggleClimbing = behemoth.movementRequested ? behemoth.stopClimbing : behemoth.startClimbing

  return (
    <StyledGameControls>
      <Stack direction="row">
        <Button onClick={onToggleClimbing}>{behemoth.movementRequested ? 'Stop climbing' : 'Start climbing'}</Button>
        <Divider orientation="vertical" flexItem />
        <Button disabled={behemoth.inMotion}>Do stuff</Button>
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