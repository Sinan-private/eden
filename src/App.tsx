import './App.css'
import {GameProvider} from "./context/game.context.ts";
import {Game} from "./GameUI/Game.tsx";
import {AdminPanel} from "./AdminPanel/AdminPanel.tsx";


function App() {

  return (
    <>
      <GameProvider>
        <Game/>
        {/*<AdminPanel />*/}
      </GameProvider>
    </>
  )
}

export default App
