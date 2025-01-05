import {Box, CircularProgress, CircularProgressProps, Typography} from "@mui/material";
import {useGame} from "../context/game.context.ts";

export const SlaveCount = ({size = 40}: {size?: number}) => {
  const {slaves_enslaved, slave_health} = useGame().slaves
  return (
    <CircularProgressWithLabel value={slave_health.value} label={slaves_enslaved.state.value} size={size} />
  )
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; label: number; size?: number },
) {
  return (
    <Box id="Slave_Circular" sx={{position: 'relative', display: 'inline-flex'}}>
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