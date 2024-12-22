import {Box, FormControl, IconButton, InputLabel, MenuItem, Stack, TextField} from "@mui/material";
import Close from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import {observer} from "mobx-react";
import {Resource} from "../Resource/Single";
import {ChangeEvent, useState} from "react";
import {useAdmin} from "../../Resource/Admin/admin.context.ts";
import {Icon} from "../Resource/Single/genericTypes.ts";
import {IconPickerModal} from "./IconPicker/IconPickerModal.tsx";
import {resourceTypes} from "../generated/resourceTypes.ts";
import {useToggle} from "../hooks/useToggle.ts";
import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";
import {AdminCost} from "./AdminCost.tsx";

type EditResourceProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  onClose(): void;
  onSubmit(): void;
  enableKeyEdit?: boolean
}

export const EditResource = observer(({resource, onClose, onSubmit, enableKeyEdit}: EditResourceProps) => {
  const {
    icon,
    label,
    key,
    min,
    max,
    value,
    type,
    setTo,
  } = resource;
  const {
    write__initialResources,
    isDisabled,
    resources: {
      allResources
    }
  } = useAdmin()
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);

  const [isKeyPristine, setIsKeyPristine] = useState(true);
  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);
  const onSelectIcon = (clickedIcon: Icon) => {
    resource.setTo({iconName: clickedIcon.name})
    handleCloseIconPicker()
  }
  const onSetKey = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resource.setTo({key: e.target.value as ResourceKeys})
    // setKey(e.target.value as ResourceKeys);
    if (isKeyPristine) {
      setIsKeyPristine(false)
    }
  }
  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('me')
    resource.setTo({label: e.target.value})
    if (isKeyPristine && enableKeyEdit) {
      const generatedKey = e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys
      resource.setTo({key: generatedKey})
    }
  }
  const onChange = (change: 'min' | 'max' | 'value') =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setTo({[change]: Number(e.target.value)})
  const onSetMin = onChange('min');
  const onSetMax = onChange('max');
  const onSetValue = onChange('value');
  const keyAlreadyExists = getKeyAlreadyExists(allResources, resource);
  const onBlurMax = () => {
    const shouldBeInfinite = (resource?.max || 0) < 1
    if (shouldBeInfinite) {
      resource?.setTo({max: Infinity})
    }
  }
  const onSetType = (e: any) => {
    const _type = e.target.value as ResourceTypes
    resource?.setTo({type: _type})
  }

  const onSubmitChanges = () => {
    if (!(keyAlreadyExists && enableKeyEdit)) {
      write__initialResources()
      onSubmit();
    }
  }
  const saveDisabled = isDisabled(key) || (enableKeyEdit && keyAlreadyExists) || !resource!.key.length;


  return (
    <>
      <Box position="relative" pt={4} display="flex" gap={4}>
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
        <Stack direction="row" spacing={1} alignItems="center" minWidth={280}>
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
            value={key}
            onChange={onSetKey}
            disabled={!enableKeyEdit}
            error={keyAlreadyExists}
          />
        </Stack>
        <Stack direction="row" alignItems="center">
          <TextField
            type="number"
            label="min"
            value={min}
            onChange={onSetMin}
            size="small"
            sx={{
              right: -1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
          />
          <TextField
            type="number"
            label="Initial"
            value={value}
            onChange={onSetValue}
          />
          <TextField
            type={max === Infinity ? "text" : "number"}
            label="Max"
            value={max}
            onChange={onSetMax}
            onBlur={onBlurMax}
            size="small"
            sx={{
              left: -1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
          />

        </Stack>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Type"
            onChange={onSetType}
          >
            {resourceTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <button onClick={onSubmitChanges} disabled={saveDisabled}>
          Save
        </button>
      </Box>
      <AdminCost resource={resource} />
    </>
  )
})

const getKeyAlreadyExists = (
  resources: Resource<ResourceKeys, ResourceTypes>[],
  resource: Resource<ResourceKeys, ResourceTypes>
) => resources
  .filter(({id}) => id !== resource?.id)
  .map(({key}) => key)
  .includes(resource?.key as ResourceKeys);