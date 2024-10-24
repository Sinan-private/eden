import {useMemo, useState} from "react";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import {Chip, IconButton, Stack, Typography} from "@mui/material";
import {ResourceState} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../Resource/types.ts";
import {useGame} from "../context/game.context.ts";
import {EditResource} from "./EditResource.tsx";

export const AdminResource = ({resource: _resource}: { resource: ResourceState<ResourceKeys, ResourceTypes> }) => {
  const {get} = useGame().resources;
  const resource = get(_resource.key)
  const [edit, setEdit] = useState(false);


  const cost = useMemo(() => (
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
  ), [get, resource.cost?.give]);

  if (edit) {
    return (<EditResource resource={resource} onSubmit={() => setEdit(false)} />)
  }

  return (

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      mb={2}
      justifyContent="space-between"
      sx={{width: 440}
      }>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack width={80} alignItems="flex-end">
          <Typography sx={{mb: -1}} variant="caption">{resource.label}</Typography>
          <Typography
            variant="h5">{resource.beautify.value} {resource.max !== Infinity ? `(${resource.max})` : ''}</Typography>
        </Stack>
        <img src={resource.icon} alt={resource.label} width={32} height={32}/>
      </Stack>
      {cost}
      <Chip label={resource.type} size="small"/>
      <IconButton onClick={() => setEdit(true)} sx={{alignSelf: 'flex-end'}}>
        <ModeEditOutlineIcon/>
      </IconButton>
    </Stack>
  )
}