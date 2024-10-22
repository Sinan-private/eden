import styled from "styled-components";
import Select from "@mui/material/Select";
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
import {Icon, TradeChange} from "../Resource/types.ts";
import {Cost} from "./Cost.tsx";
import {Resource} from "../Resource";
import {SelectResourceForCost} from "./SelectResourceForCost.tsx";
import {useResourceEdit} from "./useResourceEdit.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {useState} from "react";
import {useToggle} from "../hooks/useToggle.ts";

type ResourceProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
};

export type OnSetCost = (
  changeType: 'give' | 'gain',
  change: TradeChange<ResourceKeys>
) => void

export const EditResource = (
  {
    resource,
  }: ResourceProps) => {
  const {
    value,
    label,
    type,
    cost,
    openAddCost,
    icon,
    onSetCost,
    onAddCost,
    handleCloseAddCost,
    handleTypeChange,
    handleOpenAddCost,
    isDisabled,
    updateValue,
    onSetLabel,
    onSetValue,
    onRemoveCost,
    setIcon,
    costChangeKey,
  } = useResourceEdit(resource);
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [showCost, onToggleCost] = useToggle(false);
  const [showUsed, onToggleFilter] = useToggle(false);


  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);
  const onSelectIcon = (clickedIcon: Icon) => {
    setIcon(clickedIcon.name)
    handleCloseIconPicker()
  }

  const costToSelectFrom = cost && costChangeKey.length ? cost[costChangeKey as 'give' | 'gain'] : []


  return (
    <>
      <Modal
        open={openIconPicker}
        onClose={handleCloseIconPicker}
      >
        <Box sx={{...style, pt: 8}}>
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
          <IconPicker showUsed={showUsed} onClick={onSelectIcon}/>
        </Box>
      </Modal>
      <Modal
        open={openAddCost}
        onClose={handleCloseAddCost}
      >
        <Box sx={style}>
          <SelectResourceForCost onAddCost={onAddCost} cost={costToSelectFrom}/>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <img
          src={icon}
          alt={resource.label}
          width={32}
          height={32}
          onClick={handleOpenIconPicker}
        />
        <TextField
          type="text"
          label="Name"
          value={label}
          onChange={onSetLabel}
        />
        <TextField
          type="number"
          label="Start amount"
          value={value}
          onChange={onSetValue}
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
      <Typography onClick={onToggleCost}>Cost</Typography>
      {!!resource.cost &&
        <>
          <Collapse in={showCost}>

            <Stack direction="row" spacing={2} mb={4} mt={2} alignItems="center">
              <Cost
                // resource={resource}
                onRemoveCost={onRemoveCost}
                cost={cost}
                onSetCost={onSetCost}
                onOpenAddCost={handleOpenAddCost}
              />
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
  // width: '60vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
