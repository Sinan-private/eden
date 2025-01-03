import {useGame} from "../context/game.context.ts";
import {Box} from "@mui/material";
import {Debug} from "../Components/Debug.tsx";

export const Debug_Behemoth = () => {
  const {behemoth, resources} = useGame()
  const {digging_depth, flushing_depth, drying_delay} = behemoth
  const liquid_mana = resources.getByType("liquid_mana")
  const dirty_mana = resources.getByType("dirty_mana")
  const raw_mana = resources.getByType("raw_mana")

  return (
    <Debug>
      <Box sx={{fontFamily: 'monospace', fontSize: '12px', color: '#79ae79'}}>
        <Box>Digging Depth{digging_depth.beautify.value}</Box>
        <Box>Flushing depth {flushing_depth.beautify.value}</Box>
        <Box>Drying delay {drying_delay}</Box>
        <Box display="flex" gap={2}>

          <Box>{liquid_mana.map(({beautify, id, label}) => (
            <Box key={id}>
              {label}: {beautify.value}
            </Box>
          ))}</Box>
          <Box>{dirty_mana.map(({beautify, id, label}) => (
            <Box key={id}>
              {label}: {beautify.value}
            </Box>
          ))}</Box>
          <Box>{raw_mana.map(({beautify, id, label}) => (
            <Box key={id}>
              {label}: {beautify.value}
            </Box>
          ))}</Box>
        </Box>
      </Box>
    </Debug>
  )
}
