import {Box, LinearProgress, Stack} from "@mui/material";
import {useGame} from "./context/game.context.ts";

export const FactionManager = () => {
  const {all} = useGame().factions;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2}}>
      {all.map(({image, visible, active, loyalty, influence, progress}) => (
        <Box key={image} sx={{display: visible ? 'block' : 'none'}}>
          <Box sx={{position: 'relative', width: 70, height: 70}}>
            <img
              src={image}
              alt={image}
              style={{width: '100%', height: '100%', filter: active ? '' : 'saturate(0) brightness(0.2) contrast(0.8)'}}
            />
            <VerticalProgress value={progress} />
          </Box>
          <Stack>
            <LinearProgress variant="determinate" value={loyalty} color="warning"/>
            <LinearProgress variant="determinate" value={influence} color="error"/>
          </Stack>
        </Box>
      ))}
    </Box>
  )
}

const VerticalProgress = ({value = 50}: {value?: number}) => {
  const absolute = {position: 'absolute', bottom: 0, right: 0}
  return (
    <Box id="custom progress" sx={{width: 4, height: '100%', background: '#ffffff21', ...absolute}}>
      <Box sx={{width: '100%', height: value + '%', backgroundColor: 'white', ...absolute}} />
    </Box>
  )
}