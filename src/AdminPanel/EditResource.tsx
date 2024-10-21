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
import {TradeChange} from "../Resource/types.ts";
import {Cost} from "./Cost.tsx";
import {Resource} from "../Resource";
import {SelectResourceForCost} from "./SelectResourceForCost.tsx";
import {useResourceEdit} from "./useResourceEdit.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";

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
    showUsed,
    showCost,
    open,
    cost,
    openAddCost,
    icon,
    onSetCost,
    onAddCost,
    handleClose,
    handleOpen,
    handleCloseAddCost,
    handleTypeChange,
    handleOpenAddCost,
    onClickIcon,
    isDisabled,
    onToggleFilter,
    onToggleCost,
    updateValue,
    onSetLabel,
    onSetValue,
    costForBla
  } = useResourceEdit(resource);
  // if (resource.key === 'meat') {
  //
  // cost && console.log(cost.give[0])
  // cost && console.log(enrichCost(cost).give[0])
  // }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
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
          <IconPicker showUsed={showUsed} onClick={onClickIcon}/>
        </Box>
      </Modal>
      <Modal
        open={openAddCost}
        onClose={handleCloseAddCost}
      >
        <Box sx={style}>
          <SelectResourceForCost onAddCost={onAddCost} cost={costForBla}/>
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