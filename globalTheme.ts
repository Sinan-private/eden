import {createTheme} from "@mui/material";
import {green, lightBlue} from "@mui/material/colors";

export const theme = createTheme({
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
