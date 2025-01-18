import {observer} from "mobx-react";
import {Box, LinearProgress, Paper, Typography} from "@mui/material";
import {ResourceClass} from "../../Resource";

type ValueDisplayProps = {
  resource: ResourceClass;
  label?: string;
}
export const ValueDisplay = observer(({resource, label = resource.label}: ValueDisplayProps) => (
  <Paper>
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <Typography variant="caption">{label}</Typography>
      <Typography>{resource.beautify.value}</Typography>
    </Box>
    <LinearProgress variant="determinate" value={resource.percentage} sx={{color: 'white'}}/>
  </Paper>
))