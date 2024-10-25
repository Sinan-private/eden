import './App.css'
import {GameProvider} from "./context/game.context.ts";
import {Game} from "./GameUI/Game.tsx";
import AdminPanel from "./AdminPanel";
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {AdminProvider} from "./Resource/Admin/admin.context.ts";


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
