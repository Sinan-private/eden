import Box from "@mui/material/Box";
import {FormControl, IconButton, InputLabel, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import Close from "@mui/icons-material/Close";
import {IconPickerModal} from "../IconPickerModal.tsx";
import Select from "@mui/material/Select";
import {resourceTypes} from "../../../generated/resourceTypes.ts";
import {Cost} from "../Cost.tsx";
import {ChangeEvent, ReactNode} from "react";
import {themeColors} from "../../../assets/colors.ts";
import {ResourceKeys, ResourceTypes} from "../../../specificTypes.ts";
import {EditAmount, EditAmountProps} from "./EditAmount.tsx";
import {useResourceClone} from "../../../useResourceClone.ts";
import {Icon} from "../../../genericTypes.ts";
import {EditResourceProps} from "./types.ts";

type ResourceCloneProps<K extends string, T extends string> = Pick<
  ReturnType<typeof useResourceClone<K, T>>,
  'min'
  | 'max'
  | 'value'
  | 'key'
  | 'label'
  | 'type'
  | 'cost'
  | 'revealedAt'
  | 'icon'
  | 'onSetCost'
  | 'onAddCost'
  | 'onRemoveCost'
  | 'onSetRevealedAt'
  | 'onAddRevealedAt'
  | 'onRemoveRevealedAt'
  | 'handleTypeChange'
>

type EditResourceViewProps = {
  openIconPicker: boolean;
  filterUsed: boolean;
  handleCloseIconPicker(): void;
  handleOpenIconPicker(): void;
  onToggleFilter(): void;
  onSelectIcon(clickedIcon: Icon): void;
  onSetLabel(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onSetKey(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  keyAlreadyExists: boolean;
  onSubmitChanges(): void;
  saveDisabled: boolean;
} & EditAmountProps & ResourceCloneProps<ResourceKeys, ResourceTypes> & EditResourceProps;

export const EditResourceView = (
  {
    key,
    label,
    type,
    cost,
    revealedAt,
    icon,
    onSetCost,
    onAddCost,
    onRemoveCost,
    // onCreateRevealedAt,
    onSetRevealedAt,
    onAddRevealedAt,
    onRemoveRevealedAt,
    handleTypeChange,
    onClose,
    openIconPicker,
    handleCloseIconPicker,
    filterUsed,
    onToggleFilter,
    onSelectIcon,
    handleOpenIconPicker,
    onSetLabel,
    onSetKey,
    enableKeyEdit,
    keyAlreadyExists,
    onSubmitChanges,
    saveDisabled,
    ...valueProps
  }: EditResourceViewProps
) => (
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
      <EditAmount {...valueProps} />
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
    <StyledCostBox title="Cost">
      <Cost
        onRemoveCost={onRemoveCost}
        cost={cost}
        onSetCost={onSetCost}
        onAddCost={onAddCost}
      />
    </StyledCostBox>
    <StyledCostBox title="Reveal">
      <Cost
        onRemoveCost={onRemoveRevealedAt}
        cost={revealedAt}
        onSetCost={onSetRevealedAt}
        onAddCost={onAddRevealedAt}
      />
    </StyledCostBox>
  </Box>
)


type StyledCostBoxProps = {
  children: ReactNode;
  title: string;
}

const StyledCostBox = ({children, title}: StyledCostBoxProps) => (
  <Paper sx={{
    mx: 2,
    mt: 2,
    p: 1,
    pl: 3,
    backgroundColor: themeColors.color1,
    borderRadius: 8,
    display: 'flex',
    // alignItems: 'center',
  }}>
    <Typography variant="h6" fontWeight="bold" color={themeColors.color5} sx={{mr: 2, width: 120}} align="left">
      {title}
    </Typography>
    <Stack direction="row" spacing={2} alignItems="center">
      {children}
    </Stack>
  </Paper>
)


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
