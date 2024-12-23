import './App.css'
import {GameProvider} from "./context/game.context.ts";
import AdminPanel from "./ResourceHandling/Admin";
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {AdminProvider} from "./ResourceHandling/Admin/admin.context.ts";
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
