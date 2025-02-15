import {AdminResourceProvider} from "./Resource";
import {Game} from "./test_eden/Game.tsx";
import {GameProvider} from "./test_eden/context/game.context.ts";
import {useEffect} from "react";

function App() {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.add("dark")
  }, []);

  return (
    <>
      <AdminResourceProvider initialState={{admin: {buttonPosition: "bottom-right"}}}>
        <GameProvider>
          <Game/>
        </GameProvider>
      </AdminResourceProvider>
    </>
  )
}

export default App
