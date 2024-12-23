import './App.css'
import {ThemeProvider} from "@mui/material";
import {GameProvider} from "./context/game.context.ts";
import AdminPanel, {AdminProvider} from "./ResourceHandling/Admin";
import {theme} from "../globalTheme.ts";
import Game from "./GameUI";

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
          <GameProvider>
            <AdminProvider>
              <Game/>
              <AdminPanel/>
            </AdminProvider>
          </GameProvider>
      </ThemeProvider>
    </>
  )
}

export default App
