import './App.css'
import {ThemeProvider} from "@mui/material";
import {theme} from "../globalTheme.ts";
import {AdminResourceProvider} from "./Resource";
import {Game} from "./test_eden/Game.tsx";

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <AdminResourceProvider initialState={{admin: {buttonPosition: "top-left"}}}>
          <Game/>
        </AdminResourceProvider>
      </ThemeProvider>
    </>
  )
}

export default App
