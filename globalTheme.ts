import {createTheme} from "@mui/material";
import {green, lightBlue} from "@mui/material/colors";

export const theme = createTheme({

  typography: {
    h2: {
      fontSize: '2.5rem',
    }
  },
  palette: {
  mode: 'dark',
    primary: {
      main: lightBlue[500],
    },
    secondary: {
      main: green[500],
    },
  },
});
