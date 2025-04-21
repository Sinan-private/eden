import {Game} from "@/Game/Game.tsx";
import {useGameInitializer} from "@/Game/Classes/Game/useGameInitializer.ts";
import {ResourceAdmin} from "@/GameController/Resource/Admin/ResourceAdmin.tsx";

function App() {
  const gameReady = useGameInitializer();
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
