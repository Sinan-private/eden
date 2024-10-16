import './App.css'
import {GameProvider} from "./context/game.context.ts";
import {Game} from "./GameUI/Game.tsx";


function App() {

  return (
    <>
      <GameProvider>
        <Game/>
      </GameProvider>
    </>
  )
}

export default App
