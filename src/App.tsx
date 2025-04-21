import {Game} from "./test_eden/Game.tsx";
import {useGameInitializer} from "@/test_eden/Classes/Game/useGameInitializer.ts";
import {ResourceAdmin} from "@/Resource/Admin/ResourceAdmin.tsx";

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
