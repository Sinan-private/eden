import {Box} from "@mui/material";
import {Debug_Behemoth} from "../Debugging/Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "../Debugging/Debug_SlaveManagement.tsx";

export const DebuggingComponents = () => (
  <>
    <Box sx={{position: 'absolute', bottom: 50, left: 10}}>
      <Debug_Behemoth/>
    </Box>
    <Box sx={{position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', zIndex: 1}}>
      <Debug_SlaveManagement/>
    </Box>
  </>
)
