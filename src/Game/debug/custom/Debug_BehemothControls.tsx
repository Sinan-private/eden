import {useEffect} from "react";
import {observer} from "mobx-react";
import {Button} from "@/GameController/components/ui";
import {game} from "@/Game/Classes/Game";

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
    <div className="relative bottom-0 left-1/2 -translate-x-1/2 py-2 px-3 z-[100]">
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
    </div>
  )
})
