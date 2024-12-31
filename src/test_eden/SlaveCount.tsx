import {Box, CircularProgress, CircularProgressProps, Typography} from "@mui/material";
import {useGame} from "./context/game.context.ts";

export const SlaveCount = () => {
  const {slave_count, slave_health} = useGame().slaves
  return (
    <CircularProgressWithLabel value={slave_health} label={slave_count}/>
  )
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; label: number },
) {
  return (
    <Box sx={{position: 'relative', display: 'inline-flex'}}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{color: 'text.secondary'}}
        >{`${Math.round(props.label)}`}</Typography>
      </Box>
    </Box>
  );
}