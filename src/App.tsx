import './App.css'
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {AdminResourceProvider} from "./Resource";
import {Game} from "./test_eden/Game.tsx";
import {GameProvider} from "./test_eden/context/game.context.ts";

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <AdminResourceProvider initialState={{admin: {buttonPosition: "top-left"}}}>
          <GameProvider>
            <Game/>
          </GameProvider>
        </AdminResourceProvider>
      </ThemeProvider>
    </>
  )
}

export default App
