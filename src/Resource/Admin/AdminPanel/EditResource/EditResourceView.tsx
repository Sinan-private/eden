import Box from "@mui/material/Box";
import {FormControl, IconButton, InputLabel, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import Close from "@mui/icons-material/Close";
import {IconPickerModal} from "../IconPickerModal.tsx";
import Select from "@mui/material/Select";
import {resourceTypes} from "../../../generated/resourceTypes.ts";
import {Cost} from "../Cost.tsx";
import {ReactNode} from "react";
import {themeColors} from "../../../assets/colors.ts";
import {EditAmount} from "./EditAmount.tsx";
import {EditResourceViewProps, KeyInputProps} from "./types.ts";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const EditResourceView = (
  {
    _key,
    label,
    type,
    cost,
    revealedAt,
    icon,
    onSetCost,
    onAddCost,
    onRemoveCost,
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
    onDeleteCost,
    onDeleteRevealedAt,
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
        value={_key}
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
    <StyledCostBox title="Cost" onDelete={onDeleteCost}>
      <Cost
        onRemoveCost={onRemoveCost}
        cost={cost}
        onSetCost={onSetCost}
        onAddCost={onAddCost}
      />
    </StyledCostBox>
    <StyledCostBox title="Reveal" onDelete={onDeleteRevealedAt}>
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
  onDelete(): void;
}

const StyledCostBox = ({children, title, onDelete}: StyledCostBoxProps) => (
  <Paper sx={{
    mx: 2,
    mt: 2,
    p: 1,
    pl: 3,
    backgroundColor: themeColors.color1,
    borderRadius: 8,
    display: 'flex',
    position: 'relative'
  }}>
    <Stack direction="row" spacing={2} sx={{alignSelf: 'baseline'}}>

    <IconButton size="small" onClick={onDelete}>
      <DeleteOutlineIcon fontSize="inherit" />
    </IconButton>
    <Typography variant="h6" fontWeight="bold" color={themeColors.color5} sx={{mr: 2, width: 120}} align="left">
      {title}
    </Typography>
    </Stack>
    <Stack direction="row" spacing={2} alignItems="center">
      {children}
    </Stack>
  </Paper>
)


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
