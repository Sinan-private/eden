import {ChangeEvent, useMemo, useState} from "react";
import Select from "@mui/material/Select";
import {
  Collapse,
  FormControl, IconButton,
  InputLabel,
  MenuItem,
  Stack, SxProps,
  TextField,
  Typography
} from "@mui/material";
import {Icon, ResourceKeys, ResourceState, ResourceTypes, TradeChange} from "../Resource/types.ts";
import {Cost} from "./Cost.tsx";
import {ResourceCloneConfig, useResourceClone} from "../Resource/useResourceClone.ts";
import {useToggle} from "../Resource/hooks/useToggle.ts";
import {IconPickerModal} from "./IconPickerModal.tsx";
import {AddCostModal} from "./AddCostModal.tsx";
import {useGame} from "../context/game.context.ts";
import {resourceTypes} from "../Resource/generated/resourceTypes.ts";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

type EditResourceProps = {
  resource?: Partial<ResourceState<ResourceKeys, ResourceTypes>>;
  onSubmit?(): void;
  onClose?(): void;
  enableKeyEdit?: boolean;
  sx?: SxProps;
};
export type ChangeKey = 'give' | 'gain' | '';


export type OnSetCost = (
  changeType: 'give' | 'gain',
  change: TradeChange<ResourceKeys>
) => void

export const EditResource = (
  {
    resource,
    enableKeyEdit,
    sx,
    onClose,
    onSubmit = () => {
    },
  }: EditResourceProps) => {
  const {get, getByType} = useGame().resources;
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [showCost, onToggleCost] = useToggle(false);
  const [filterUsed, onToggleFilter] = useToggle(false);
  const [openAddCost, setOpenAddCost] = useState(false);
  const [costChangeKey, setCostChangeKey] = useState<ChangeKey>('');
  const [isKeyPristine, setIsKeyPristine] = useState(true);
  const config: Partial<ResourceCloneConfig<ResourceKeys, ResourceTypes>> = {
    onAddCost: () => setOpenAddCost(false)
  }

  const {
    key,
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
    setKey,
    setIconName,
    setLabel,
    setValue,
    setMin,
    setMax,
  } = useResourceClone(resource, config);

  const keyAlreadyExists = getByType().map(({key}) => key).includes(key);

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

  const onSetKey = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setKey(e.target.value as ResourceKeys);
    if (isKeyPristine) {
      setIsKeyPristine(false)
    }
  }
  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLabel(e.target.value)
    if (isKeyPristine) {
      setKey(e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys)
    }
  }
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
  const onSubmitChanges = () => {
    if (!(keyAlreadyExists && enableKeyEdit)) {
      updateResource();
      onSubmit();
    }
  }

  const saveDisabled = isDisabled || (enableKeyEdit && keyAlreadyExists) || !key.length;

  const costButton = useMemo(() => {
    const icon = (key: ResourceKeys) => get(key).icon
    return (
      <Stack direction="row" alignItems="center" spacing={1} minHeight={40} sx={sx}>
        <Typography onClick={onToggleCost}>Cost</Typography>
        <Stack direction="row" spacing={0.5}>
          {resource?.cost?.give && resource.cost.give.map(cost => (
            <img key={cost.key} src={icon(cost.key)} width={16} height={16} alt={cost.key}/>
          ))}
        </Stack>
        {resource?.cost?.gain && resource.cost?.gain.length > 1 &&
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography>{"->"}</Typography>
            {resource.cost?.gain && resource.cost?.gain.length > 1 && resource.cost.gain.map(cost => (
              <img key={cost.key} src={icon(cost.key)} width={16} height={16} alt={cost.key}/>
            ))}
          </Stack>
        }
      </Stack>
    )
  }, [get, onToggleCost, resource, sx])

  return (
    <Box position="relative" pt={4}>
      {!!onClose &&
        <Box sx={{position: 'absolute', top: 0, right: 0}}>
          <IconButton onClick={() => onClose()} size="small">
            <Close fontSize="inherit"/>
          </IconButton>
        </Box>
      }
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
        <KeyInput
          value={key}
          onChange={onSetKey}
          enableKeyEdit={enableKeyEdit}
          keyAlreadyExists={keyAlreadyExists}
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

        <button onClick={onSubmitChanges} disabled={saveDisabled}>
          Save
        </button>
      </Stack>
      {costButton}
      {!!resource?.cost &&
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
    </Box>
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

type KeyInputProps = {
  value: ResourceKeys;
  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  keyAlreadyExists: boolean;
  enableKeyEdit?: boolean;
}

const KeyInput = (
  {
    value,
    onChange,
    keyAlreadyExists,
    enableKeyEdit
  }: KeyInputProps
) => {
  return (
    <TextField
      type="text"
      label="Key"
      value={value}
      onChange={onChange}
      disabled={!enableKeyEdit}
      error={enableKeyEdit && keyAlreadyExists}
    />
  )
}
