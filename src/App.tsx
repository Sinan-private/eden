import './App.css'
import {GameProvider} from "./context/game.context.ts";
import {Game} from "./GameUI/Game.tsx";
import AdminPanel from "./AdminPanel";
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";


function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <GameProvider>
          <Game/>
          <AdminPanel/>
        </GameProvider>
      </ThemeProvider>
    </>
  )
}

export default App
