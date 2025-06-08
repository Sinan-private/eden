import {Game} from "@/Game/Game.tsx";
import {useGameInitializer} from "@/Game/Classes/Game/useGameInitializer.ts";
import {ResourceAdmin} from "@/GameEngine";
import {GameBaseControlledCreationProps} from "@/GameEngine/GameEngine.ts";
import {DebuggingComponents} from "@/Game/debug/custom/DebuggingComponents.tsx";
import {events} from "@/Game/constants/events.ts";

const TICKS_PER_SECOND = 40;
const TICKS_PER_TURN = 20;
const TICK_AUTO_START = false;

const initialConfig: GameBaseControlledCreationProps = {
  tick: {
    ticks_per_second: TICKS_PER_SECOND,
    ticks_per_turn: TICKS_PER_TURN,
    auto_start: TICK_AUTO_START
  },
  events
}

function App() {
  const gameReady = useGameInitializer(initialConfig);
  if (!gameReady) {
    return null;
  }

  return (
    <>
      <Game/>
      <ResourceAdmin buttonPosition={"bottom-right"} customComponents={[{label: 'Slave actions', component: (<DebuggingComponents />)}]} />
    </>
  )
}

export default App
