import {useEffect} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {Button} from "@/components/ui";

export const Debug_BehemothControls = observer(() => {
  const {behemoth} = useGame();
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
      <div className="flex">
        <Button
          disabled={!behemoth.movement_requested && !behemoth.can_start_moving}
          onClick={onToggleClimbing}
          variant="outline"
        >
          {behemoth.movement_requested ? 'Stop climbing' : 'Start climbing'}
        </Button>
        <Button
          disabled={!behemoth.can_dig}
          onClick={onToggleDigging}
          variant="outline"
        >
          {behemoth.digging_requested ? 'Stop digging' : 'Start digging'}
        </Button>
        <Button
          disabled={!behemoth.can_flush}
          onClick={onToggleFlushing}
          variant="outline"
        >
          {behemoth.flushing_requested ? 'Stop flushing' : 'Start flushing'}
        </Button>
      </div>
    </StyledGameControls>
  )
})

const StyledGameControls = styled.div`
    position: relative;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    //border: 1px solid red;
    padding: 8px 12px;
    z-index: 100;
`