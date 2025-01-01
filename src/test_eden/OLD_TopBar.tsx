import {useGame} from "./context/game.context.ts";
import {Box, Divider, Paper, Typography} from "@mui/material";
import {SlaveCount} from "./Components/SlaveCount.tsx";

export const TopBar = () => {
  const {resources, behemoth} = useGame();
  const {getByType} = resources;
  const inactiveStyle = {filter: 'saturate(0) brightness(0.3) contrast(0.9)'}
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      <Paper sx={{display: 'flex', gap: 2, py: 2, px: 3}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}} mr={2}>
          <SlaveCount/>
          <Typography variant="body2" mt={1}>Slaves</Typography>
        </Box>
        <Divider orientation="vertical" flexItem/>
        <Box mr={4}>
          <Typography variant="caption">Raw</Typography>
          <Typography>{behemoth.raw_mana}</Typography>
        </Box>
        {getByType('mana').map(({id, beautify, icon, value}) => (
          <Box key={id}>
            <img src={icon} alt={icon} style={value < 1 ? inactiveStyle : {}}/>
            <Typography>{beautify.value}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  )
}
