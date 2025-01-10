import {Debug_BehemothControls} from "../Debugging/Debug_BehemothControls.tsx";
import {TopBar} from "../TopBar.tsx";
import {Box} from "@mui/material";
import {FactionManager} from "../FactionManager.tsx";
import {SlaveManager} from "../Components/SlaveManager.tsx";

export const Interface = () => {
  return (
    <>
      <Debug_BehemothControls/>
      <TopBar/>
      <Box sx={{position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)'}}>
        <FactionManager/>
      </Box>
      <Box sx={{position: 'absolute', bottom: 50, right: 50, zIndex: 1}}>
        <SlaveManager/>
      </Box>
    </>
  )
}