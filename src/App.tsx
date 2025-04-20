import {AdminResourceProvider} from "./Resource";
import {Game} from "./test_eden/Game.tsx";
import {GameProvider} from "./test_eden/context/game.context.ts";
import {useGameInitializer} from "@/test_eden/Classes/Game/useGameInitializer.ts";

function App() {
  const gameReady = useGameInitializer();
  if (!gameReady) {
    return null;
  }

  return (
    <>
      <AdminResourceProvider initialState={{
        admin: {buttonPosition: "bottom-right"},
      }}>
        <GameProvider>
          <Game/>
        </GameProvider>
      </AdminResourceProvider>
    </>
  )
}

export default App
