import {ChangeEvent, useState} from "react";
import {Icon, ResourceCostUpdate} from "../../../genericTypes.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {ResourceKeys, ResourceTypes} from "../../../specificTypes.ts";
import {useAdmin} from "../../../../Version 3/Admin/admin.context.ts";
import {EditResourceView} from "./EditResourceView.tsx";
import {observer} from "mobx-react";
import {SxProps} from "@mui/material";

// I want to use the ID instead of the key to avoid issues

type EditResourceProps = {
  id: string;
  onSubmit?(): void;
  onClose?(): void;
  enableKeyEdit?: boolean;
  sx?: SxProps;
};

export const EditResourceController = observer((
  {
    id,
    enableKeyEdit,
    onClose,
    onSubmit = () => {
    },
  }: EditResourceProps) => {
  const {
    isDisabled,
    write__initialResources,
    resources: {
      allResources,
      getById
    }
  } = useAdmin();
  // const {getByType} = useAdmin().resources;
  const resource = getById(id)
  console.log(resource)
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);
  const [isKeyPristine, setIsKeyPristine] = useState(true);

  const keyAlreadyExists = allResources
    .filter(({id}) => id !== resource?.id)
    .map(({key}) => key)
    .includes(resource?.key as ResourceKeys);
  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);
  const onSelectIcon = (clickedIcon: Icon) => {
    resource?.setTo({...resource, iconName: clickedIcon.name})
    // setIconName(clickedIcon.name)
    handleCloseIconPicker()
  }
  console.log('keyAlreadyExists', keyAlreadyExists)

  const onSetKey = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resource?.setTo({key: e.target.value as ResourceKeys})
    // setKey(e.target.value as ResourceKeys);
    if (isKeyPristine) {
      setIsKeyPristine(false)
    }
  }
  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resource?.setTo({label: e.target.value})

    // setLabel(e.target.value)
    if (isKeyPristine) {
      const generatedKey = e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys
      resource?.setTo({key: generatedKey})
    }
  }
  const onSetValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(resource?.key, resource?.id)
    console.log(e.target.value)
    resource?.setValueTo(Number(e.target.value))
  }
  const onSetMin = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => resource?.setValueTo(Number(e.target.value))
  const onSetMax = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const max = Number(e.target.value);
    resource?.setTo({max: isNaN(max) ? 0 : max})
    // setMax(isNaN(max) ? 0 : max)
  }
  const onBlurMax = () => {
    const shouldBeInfinite = (resource?.max || 0) < 1

    if (shouldBeInfinite) {
      resource?.setTo({max: Infinity})
      // setMax(Infinity)
    }
  }

  const onSubmitChanges = () => {
    if (!(keyAlreadyExists && enableKeyEdit)) {
      write__initialResources()
      onSubmit();
    }
  }

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const _type = e.target.value as ResourceTypes
    resource?.setTo({type: _type})
  }

  if (!resource) {
    return null
  }
  const {key, ...restResource} = resource!
  const saveDisabled = isDisabled(key) || (enableKeyEdit && keyAlreadyExists) || !resource!.key.length;

  const onUpdateCost = (cost: ResourceCostUpdate<ResourceKeys>) => {

  }

  const onRemoveCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: ResourceKeys
  ) => {
    // const newCost = _resource.removeCost(changeKey, resourceKey, cost)
    // if (newCost) {
    //   setCost(newCost)
    //   callbacks.onRemoveCost(getResourceState({cost: newCost}));
    // }
  }

  return (
    <EditResourceView
      {...restResource}
      _key={key}
      enableKeyEdit={enableKeyEdit}
      onClose={onClose}
      openIconPicker={openIconPicker}
      filterUsed={filterUsed}
      keyAlreadyExists={keyAlreadyExists}
      saveDisabled={saveDisabled}
      handleCloseIconPicker={handleCloseIconPicker}
      handleOpenIconPicker={handleOpenIconPicker}
      onToggleFilter={onToggleFilter}
      onSelectIcon={onSelectIcon}
      onSetLabel={onSetLabel}
      onSetKey={onSetKey}
      onSubmitChanges={onSubmitChanges}
      onSetValue={onSetValue}
      onSetMin={onSetMin}
      onSetMax={onSetMax}
      onBlurMax={onBlurMax}
      handleTypeChange={handleTypeChange}
    />
  )
})
