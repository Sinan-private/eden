import './App.css'
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {Game} from "./test_eden/Game.tsx";
import {AdminResourceProvider} from "./Resource";

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <AdminResourceProvider initialState={{admin: {buttonPosition: "bottom-right"}}}>
          <Game/>
        </AdminResourceProvider>
      </ThemeProvider>
    </>
  )
}

export default App
