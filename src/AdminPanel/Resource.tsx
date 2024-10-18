import {ResourceBase} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {useMemo, useState} from "react";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useGame} from "../context/game.context.ts";
import {
  Box,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import {resourceTypes} from "../gameRules/resourceTypes.ts";
import {IconPicker} from "./IconPicker.tsx";
import {Icon} from "../Resource/types.ts";
import styled from "styled-components";
import {Cost} from "./Cost.tsx";


type ResourceProps = {
  resource: ResourceBase<ResourceKeys, ResourceTypes>;
};

export const Resource = (
  {
    resource,
  }: ResourceProps) => {
  const {
    resources: {
      mergeChangeToState,
      icons
    },
    writeInitialResources
  } = useGame();
  const [value, setValue] = useState(resource.value)
  const [label, setLabel] = useState(resource.label)
  const [type, setType] = useState(resource.type);
  const [icon, setIcon] = useState(resource.icon);
  const [showUsed, setShowUsed] = useState(false);
  const [showCost, setShowCost] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onClickIcon = (clickedIcon: Icon) => {
    console.log('me', clickedIcon)
    setIcon(clickedIcon.src)
    handleClose()
  }

  const onToggleFilter = () => setShowUsed(!showUsed);
  const onToggleCost = () => setShowCost(!showCost);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as ResourceTypes);
  };


  const updateValue = () => {
    const _icon = icons.getBySrc(icon).name;
    const newState = mergeChangeToState({
      ...resource.state,
      value,
      label,
      type,
      icon: _icon
    })
    writeInitialResources(newState)
  }

  const isDisabled = useMemo(() => {
    return !(value !== resource.value || label !== resource.label || type !== resource.type || icon !== resource.icon);
  }, [value, label, type, icon, resource])

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Header>
            <Typography variant="body2" sx={{pr: 1}}>

              Used items
            </Typography>
            <Switch
              value={showUsed}
              onChange={onToggleFilter}
              size="small"
              sx={{mr: 2}}
            />
          </Header>
          <IconPicker showUsed={showUsed} onClick={onClickIcon}/>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <img
          src={icon}
          alt={resource.label}
          width={32}
          height={32}
          onClick={handleOpen}
        />
        <TextField
          type="text"
          label="Name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <TextField
          type="number"
          label="Start amount"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          // onBlur={updateValue}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Type"
            onChange={handleTypeChange}
          >
            {resourceTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <button onClick={updateValue} disabled={isDisabled}>
          Save
        </button>
      </Stack>
      {!!resource.__cost &&
      <>
        <Typography onClick={onToggleCost}>Cost</Typography>
        <Collapse in={showCost}>

          <Stack direction="row" spacing={2} mb={4} mt={2} alignItems="center">
            <Cost resource={resource}/>
          </Stack>
        </Collapse>
      </>
      }
    </>
  )
}

const Header = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  pt: 8
};