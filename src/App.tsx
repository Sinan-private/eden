import './App.css'
import {GameProvider} from "./context/game.context.ts";
import {Game} from "./GameUI/Game.tsx";
import AdminPanel from "./Resource/Admin/AdminPanel";
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {AdminProvider} from "./Resource/Admin/admin.context.ts";
import {ResourcesProvider} from "./Resource_MobX/resources.context.ts";


function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <ResourcesProvider>

          <GameProvider>
            <AdminProvider>
              <Game/>
              <AdminPanel/>
            </AdminProvider>
          </GameProvider>
        </ResourcesProvider>
      </ThemeProvider>
    </>
  )
}

export default App
