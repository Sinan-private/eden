import {Game} from "@/Game/Game.tsx";
import {useGameInitializer} from "@/Game/Classes/Game/useGameInitializer.ts";
import {ResourceAdmin} from "@/GameController/Resource/Admin/ResourceAdmin.tsx";
import {TICK_AUTO_START, TICKS_PER_SECOND, TICKS_PER_TURN} from "@/GameController/Resource/constants.ts";
import {GameBaseControlledCreationProps} from "@/GameController/GameBaseClass.ts";

const initialConfig: GameBaseControlledCreationProps = {
  tick: {
    ticks_per_second: TICKS_PER_SECOND,
    ticks_per_turn: TICKS_PER_TURN,
    auto_start: TICK_AUTO_START
  }
}

function App() {
  const gameReady = useGameInitializer(initialConfig);
  if (!gameReady) {
    return null;
  }

  return (
    <>
      <Game/>
      <ResourceAdmin buttonPosition={"bottom-right"}/>
    </>
  )
}

export default App
