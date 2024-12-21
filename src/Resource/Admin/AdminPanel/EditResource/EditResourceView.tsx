import Box from "@mui/material/Box";
import {FormControl, IconButton, InputLabel, MenuItem, Stack, TextField} from "@mui/material";
import Close from "@mui/icons-material/Close";
import {IconPickerModal} from "../IconPickerModal.tsx";
import Select from "@mui/material/Select";
import {resourceTypes} from "../../../generated/resourceTypes.ts";
import {EditAmount} from "./EditAmount.tsx";
import {EditResourceViewProps} from "./types.ts";
import {EditCostType} from "./EditCostType.tsx";

export const EditResourceView = (
  {
    _key,
    id,
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
      <TextField
        type="text"
        label="Key"
        value={_key}
        onChange={onSetKey}
        disabled={!enableKeyEdit}
        error={keyAlreadyExists}
      />

      <EditAmount id={id} />
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
    <EditCostType
      onDelete={onDeleteCost}
      onRemove={onRemoveCost}
      object={cost}
      onSet={onSetCost}
      onAdd={onAddCost}
    />
    <EditCostType
      onDelete={onDeleteRevealedAt}
      onRemove={onRemoveRevealedAt}
      object={revealedAt}
      onSet={onSetRevealedAt}
      onAdd={onAddRevealedAt}
    />
  </Box>
)
