import {useState} from "react";
import Select from "@mui/material/Select";
import {
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {resourceTypes} from "../gameRules/resourceTypes.ts";
import {Icon, TradeChange} from "../Resource/types.ts";
import {Cost} from "./Cost.tsx";
import {Resource} from "../Resource";
import {ResourceCloneConfig, useResourceClone} from "../Resource/useResourceClone.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {useToggle} from "../Resource/hooks/useToggle.ts";
import {IconPickerModal} from "./IconPickerModal.tsx";
import {AddCostModal} from "./AddCostModal.tsx";

type ResourceProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
};
export type ChangeKey = 'give' | 'gain' | '';


export type OnSetCost = (
  changeType: 'give' | 'gain',
  change: TradeChange<ResourceKeys>
) => void

export const EditResource = (
  {
    resource,
  }: ResourceProps) => {
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [showCost, onToggleCost] = useToggle(false);
  const [filterUsed, onToggleFilter] = useToggle(false);
  const [openAddCost, setOpenAddCost] = useState(false);
  const [costChangeKey, setCostChangeKey] = useState<ChangeKey>('');
  const config: Partial<ResourceCloneConfig<ResourceKeys, ResourceTypes>> = {
    onAddCost: () => setOpenAddCost(false)
  }
  const {
    value,
    label,
    type,
    cost,
    icon,
    onSetCost,
    onAddCost,
    handleTypeChange,
    isDisabled,
    updateResource,
    onSetLabel,
    onSetValue,
    onRemoveCost,
    setIconName,
  } = useResourceClone(resource, config);


  const handleOpenAddCost = (giveOrGain: ChangeKey) => {
    if (giveOrGain.length) {
      setOpenAddCost(true);
      setCostChangeKey(giveOrGain);
    }
  };
  const handleCloseAddCost = () => {
    setOpenAddCost(false);
  };

  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);
  const onSelectIcon = (clickedIcon: Icon) => {
    setIconName(clickedIcon.name)
    handleCloseIconPicker()
  }

  const costToSelectFrom = cost && costChangeKey.length ? cost[costChangeKey as 'give' | 'gain'] : []
  const _onAddCost = (change: TradeChange<ResourceKeys>) => onAddCost(costChangeKey, change);

  return (
    <>
      <IconPickerModal
        openIconPicker={openIconPicker}
        handleCloseIconPicker={handleCloseIconPicker}
        filterUsed={filterUsed}
        onToggleFilter={onToggleFilter}
        onSelectIcon={onSelectIcon}
        />
      <AddCostModal
        openAddCost={openAddCost}
        handleCloseAddCost={handleCloseAddCost}
        onAddCost={_onAddCost}
        costToSelectFrom={costToSelectFrom}
        />

      <Stack direction="row" spacing={2} alignItems="center">
        <img
          src={icon}
          alt={label}
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

        <button onClick={updateResource} disabled={isDisabled}>
          Save
        </button>
      </Stack>
      <Typography onClick={onToggleCost}>Cost</Typography>
      {!!resource.cost &&
        <>
          <Collapse in={showCost}>

            <Stack direction="row" spacing={2} mb={4} mt={2} alignItems="center">
              <Cost
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
