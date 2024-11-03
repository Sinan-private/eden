import {ChangeEvent, useState} from "react";
import {Icon} from "../../../genericTypes.ts";
import {useResourceClone} from "../../../index.ts";
import {useToggle} from "../../../hooks/useToggle.ts";
import {ResourceKeys} from "../../../specificTypes.ts";
import {useAdmin} from "../../admin.context.ts";
import {EditResourceView} from "./EditResourceView.tsx";
import {EditResourceProps} from "./types.ts";

export const EditResourceController = (
  {
    resource,
    enableKeyEdit,
    onClose,
    onSubmit = () => {
    },
  }: EditResourceProps) => {
  const {getByType} = useAdmin().resources;
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);
  const [isKeyPristine, setIsKeyPristine] = useState(true);

  const {
    key,
    isDisabled,
    updateResource,
    setKey,
    setIconName,
    setLabel,
    setValue,
    setMin,
    setMax,
    ...resourceCloneProps
  } = useResourceClone(resource);

  const keyAlreadyExists = getByType().map(({key}) => key).includes(key);
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
    const shouldBeInfinite = resourceCloneProps.max < 1

    if (shouldBeInfinite) {
      setMax(Infinity)
    }
  }

  const onSubmitChanges = () => {
    if (!(keyAlreadyExists && enableKeyEdit)) {
      updateResource();
      onSubmit();
    }
  }

  const saveDisabled = isDisabled || (enableKeyEdit && keyAlreadyExists) || !key.length;

  return (
    <EditResourceView
      {...resourceCloneProps}
      key={key}
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
    />
  )
}
