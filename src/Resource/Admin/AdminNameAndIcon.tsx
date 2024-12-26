import {Resource} from "../ResourceHandler";
import {ResourceKeys, ResourceTypes} from "../ResourceHandler/specificTypes.ts";
import {useAdmin} from "./admin.context.ts";
import {Stack, TextField} from "@mui/material";
import {observer} from "mobx-react";

type AdminNameAndIconProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  enableKeyEdit?: boolean
}
export const AdminNameAndIcon = observer(({resource, enableKeyEdit}: AdminNameAndIconProps) => {
  const {
    icon,
    label,
    key,
  } = resource
  const {
    handleOpenIconPicker,
    getActions,
  } = useAdmin();
  const {
    onSetLabel,
    onSetKey,
    keyAlreadyExists
  } = getActions(resource.id, enableKeyEdit)
  return (
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
  )
})
