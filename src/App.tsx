import './App.css'
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {Game} from "./test_kaiser/Game.tsx";
import {ResourceProvider, ResourceAdmin} from "./Resource";

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <ResourceProvider>
          <Game />
          <ResourceAdmin buttonPosition="bottom-right" />
        </ResourceProvider>
      </ThemeProvider>
    </>
  )
}

export default App
