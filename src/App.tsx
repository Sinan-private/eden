import './App.css'
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {Game} from "./test_kaiser/Game.tsx";
import {ResourceProvider} from "./Resource";

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <ResourceProvider>
          <Game />
        </ResourceProvider>
      </ThemeProvider>
    </>
  )
}

export default App
