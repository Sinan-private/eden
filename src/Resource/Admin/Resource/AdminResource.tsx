import {Resource} from "../../ResourceHandler";
import {ResourceKeys, ResourceTypes} from "../../ResourceHandler/specificTypes.ts";
import {useMemo, useState} from "react";
import {Chip, IconButton, Paper, Stack, Typography} from "@mui/material";
import {themeColors} from "../../assets/colors.ts";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import {useAdmin} from "../../context/admin.context.ts";
import {EditResource} from "./EditResource.tsx";

export const AdminResource = ({resource}: { resource: Resource<ResourceKeys, ResourceTypes> }) => {
  const {
    write__removeResource,
    canRemoveResource,
    resetResources,
    resources: {
      get
    }
  } = useAdmin()
  const [edit, setEdit] = useState(false);
  const onCloseEdit = () => {
    setEdit(false)
  };

  const onReset = () => {
    resetResources()
    onCloseEdit()
  }
  const onDeleteResource = () => write__removeResource(resource.key);

  const cost = useMemo(() => !resource ? null : (
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
  ), [get, resource]);

  if (edit) {
    return (
      <Stack width={1000} position="relative">
        <Paper sx={{p: 1, mb: 2, width: 1000, backgroundColor: themeColors.bg}}>
          <EditResource resource={resource} onSubmit={onCloseEdit} onClose={onReset}/>
        </Paper>
      </Stack>
    )
  }

  if (!resource) return null

  return (
    <Box position="relative">
      <IconButton
        onClick={onDeleteResource}
        size="small"
        disabled={!canRemoveResource(resource?.key)}
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
                <img src={resource?.icon} alt={resource?.label} width={32} height={32}/>
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
            {!!resource.type.length &&
              <Chip label={resource.type} size="small" variant="outlined"/>
            }
            <IconButton onClick={() => setEdit(true)} sx={{alignSelf: 'flex-end'}}>
              <ModeEditOutlineIcon/>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}