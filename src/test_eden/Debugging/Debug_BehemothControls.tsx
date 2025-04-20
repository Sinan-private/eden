import {useEffect} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {Button} from "@/components/ui";
import {game} from "@/test_eden/context/createSingletonGame.ts";

export const Debug_BehemothControls = observer(() => {
  const {behemoth, gameState} = game();
  const onToggleClimbing = behemoth.movement_requested ? behemoth.stopClimbing : behemoth.startClimbing
  const onToggleDigging = gameState.mana_digging ? behemoth.stopDigging : behemoth.startDigging
  const onToggleFlushing = gameState.mana_flushing ? behemoth.stopFlushing : behemoth.startFlushing

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
          {gameState.mana_digging ? 'Stop digging' : 'Start digging'}
        </Button>
        <Button
          disabled={!behemoth.can_flush}
          onClick={onToggleFlushing}
          variant="outline"
        >
          {gameState.mana_flushing ? 'Stop flushing' : 'Start flushing'}
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