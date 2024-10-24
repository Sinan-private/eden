import {useMemo, useState} from "react";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import {Chip, IconButton, Paper, Stack, Typography} from "@mui/material";
import {ResourceState} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../Resource/types.ts";
import {useGame} from "../context/game.context.ts";
import {EditResource} from "./EditResource.tsx";
import Box from "@mui/material/Box";
import Close from "@mui/icons-material/Close";

export const AdminResource = ({resource: _resource}: { resource: ResourceState<ResourceKeys, ResourceTypes> }) => {
  const {get} = useGame().resources;
  const resource = get(_resource.key)
  const [edit, setEdit] = useState(false);

  const cost = useMemo(() => (
    <Stack direction="column" minWidth={80} spacing={1}>
      <Typography variant="caption" align="left">Cost</Typography>
      <Stack direction="row" minWidth={80} spacing={1}>
        {resource.cost?.give.map(cost => (
          <Stack key={cost.key}>
            <img
              src={get(cost.key).icon}
              width={16}
              height={16}
              alt={cost.key}
            />
            <Typography variant="caption">{cost.value}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  ), [get, resource.cost]);

  if (edit) {
    return (
      <Stack width={1000} position="relative" pt={2} pr={5}>
        <Box sx={{position: 'absolute', top: 0, right: 0}}>
          <IconButton onClick={() => setEdit(false)} size="small">
            <Close fontSize="inherit"/>
          </IconButton>
        </Box>
        <EditResource resource={resource} onSubmit={() => setEdit(false)}/>
      </Stack>
    )
  }

  return (
    <Paper sx={{p: 1, mb: 2}}>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{width: 440}
        }>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{
            backgroundColor: 'rgb(255 255 255 / 3%)',
            borderRadius: 20,
            height: 40,
            width: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            <img src={resource.icon} alt={resource.label} width={32} height={32}/>
          </Box>
          <Stack width={80} alignItems="flex-end">
            <Typography sx={{mb: -1}} variant="caption">{resource.label}</Typography>
            <Typography sx={{fontSize: '1.2rem', fontWeight: 'bold'}}>
              {resource.beautify.value}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {resource.max !== Infinity ? `(${resource.max})` : ''}
              </Typography>
            </Typography>
          </Stack>
        </Stack>
        {cost}
        <Chip label={resource.type} size="small"/>
        <IconButton onClick={() => setEdit(true)} sx={{alignSelf: 'flex-end'}}>
          <ModeEditOutlineIcon/>
        </IconButton>
      </Stack>
    </Paper>
  )
}
