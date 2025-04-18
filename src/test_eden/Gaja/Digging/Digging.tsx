import {useGame} from "../../context/game.context.ts";
import {Box} from "@mui/material";
import {Tunnel} from "@/test_eden/Gaja/Digging/Tunnel.tsx";

export const Digging = () => {
  const {behemoth} = useGame()
  const {digging_depth} = behemoth
  if (behemoth.is_moving) {
    return null
  }

  return (
    <Box sx={{
      position: 'absolute',
      left: 30,
      top: '50%',
      width: '100%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    }}>
      <Box sx={{
        position: 'absolute',
        width: 200,
        height: 200,
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
      }}>
      </Box>
      <Tunnel $digging_depth={digging_depth.state.value}>
      </Tunnel>
    </Box>
  )
}
