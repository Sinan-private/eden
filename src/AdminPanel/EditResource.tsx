import {ChangeEvent, useMemo, useState} from "react";
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
import {Icon, ResourceState, TradeChange} from "../Resource/types.ts";
import {Cost} from "./Cost.tsx";
import {ResourceCloneConfig, useResourceClone} from "../Resource/useResourceClone.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {useToggle} from "../Resource/hooks/useToggle.ts";
import {IconPickerModal} from "./IconPickerModal.tsx";
import {AddCostModal} from "./AddCostModal.tsx";
import {useGame} from "../context/game.context.ts";

type ResourceProps = {
  resource: Partial<ResourceState<ResourceKeys, ResourceTypes>>;
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
  const {get} = useGame().resources;
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
    min,
    max,
    label,
    type,
    cost,
    icon,
    onSetCost,
    onAddCost,
    handleTypeChange,
    isDisabled,
    updateResource,
    onRemoveCost,
    setIconName,
    setLabel,
    setValue,
    setMin,
    setMax,
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

  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLabel(e.target.value)
  const onSetValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(Number(e.target.value))
  const onSetMin = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setMin(Number(e.target.value))
  const onSetMax = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const max = Number(e.target.value);
      setMax(isNaN(max) ? 0 : max)
  }
  const onBlurMax = () => {
    const shouldBeInfinite = max < 1

    if (shouldBeInfinite) {
      setMax(Infinity)
    }
  }

  const costToSelectFrom = cost && costChangeKey.length ? cost[costChangeKey as 'give' | 'gain'] : []
  const _onAddCost = (change: TradeChange<ResourceKeys>) => onAddCost(costChangeKey, change);

  const costButton = useMemo(() => {
    const icon = (key: ResourceKeys) => get(key).icon
    return (
    <Stack direction="row" alignItems="center" spacing={1} minHeight={40}>
      <Typography onClick={onToggleCost}>Cost</Typography>
      <Stack direction="row" spacing={0.5}>
        {resource.cost?.give && resource.cost.give.map(cost => (
          <img src={icon(cost.key)} width={16} height={16}/>
        ))}
      </Stack>
      {resource.cost?.gain && resource.cost?.gain.length > 1 &&
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography>{"->"}</Typography>
          {resource.cost?.gain && resource.cost?.gain.length > 1 && resource.cost.gain.map(cost => (
            <img key={cost.key} src={icon(cost.key)} width={16} height={16}/>
          ))}
        </Stack>
      }
    </Stack>
  )}, [onToggleCost, resource])

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
        <Stack direction="row">

          <TextField
            type="number"
            label="Start amount"
            value={value}
            onChange={onSetValue}
          />
          <TextField
            type="number"
            label="min"
            value={min}
            onChange={onSetMin}
          />
          <MaxInput
            value={max}
            onChange={onSetMax}
            onBlur={onBlurMax}
          />
        </Stack>
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
      {costButton}
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

type ConstraintInputProps = {
  value: number;
  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onBlur(): void;
}

const MaxInput = (
  {
    value,
    onChange,
    onBlur
  }: ConstraintInputProps) => {
  const isInfinity = value === Infinity;

  return (
    <TextField
      type={isInfinity ? "text" : "number"}
      label="Max"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}