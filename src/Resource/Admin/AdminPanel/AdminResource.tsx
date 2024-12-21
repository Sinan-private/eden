import {useMemo, useState} from "react";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {Chip, IconButton, Paper, Stack, Typography} from "@mui/material";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import {ResourceState} from "../../index.ts";
import {ResourceKeys, ResourceTypes} from "../../specificTypes.ts";
import {useAdmin} from "../admin.context.ts";
import {themeColors} from "../../assets/colors.ts";
import EditResource from "./EditResource";

export const AdminResource = ({resource: _resource}: { resource: ResourceState<ResourceKeys, ResourceTypes> }) => {
  const {
    write__removeResource,
    canRemoveResource,
    resources: {
      get,
    }
  } = useAdmin();
  const resource = get(_resource.key)
  const [edit, setEdit] = useState(false);
  const onCloseEdit = () => setEdit(false);
  const onDeleteResource = () => write__removeResource(resource.key);

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
      <Stack width={1000} position="relative">
        <Paper sx={{p: 1, mb: 2, width: 1000, backgroundColor: themeColors.bg}}>
          <EditResource id={resource.id} resource={resource} onSubmit={onCloseEdit} onClose={onCloseEdit}/>
        </Paper>
      </Stack>
    )
  }

  return (
    <Box position="relative">
      <IconButton
        onClick={onDeleteResource}
        size="small"
        disabled={!canRemoveResource(resource.key)}
        sx={{position: 'absolute', left: -40, top: '50%', transform: 'translateY(-50%)'}}
      >
        <DeleteOutlineIcon fontSize="inherit"/>
      </IconButton>
      <Paper id="Resource edit review" sx={{p: 1, mb: 2, width: 1000, backgroundColor: themeColors.bg}}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{width: '100%'}
          }>
          <Stack direction="row" alignItems="center" spacing={1}>
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
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label={resource.type} size="small" variant="outlined"/>
            <IconButton onClick={() => setEdit(true)} sx={{alignSelf: 'flex-end'}}>
              <ModeEditOutlineIcon/>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
