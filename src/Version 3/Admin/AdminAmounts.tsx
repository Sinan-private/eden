import {useAdmin} from "./admin.context.ts";
import {Stack, TextField} from "@mui/material";
import {Resource} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";
import {observer} from "mobx-react";

type AdminAmountsProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  enableKeyEdit?: boolean;
}
export const AdminAmounts = observer(({resource, enableKeyEdit}: AdminAmountsProps) => {
  const {
    min,
    max,
    value
  } = resource;
  const {getActions} = useAdmin();
  const {
    onSetMin,
    onSetMax,
    onSetValue,
    onBlurMax,
  } = getActions(resource.id, enableKeyEdit)
  return (
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

  )
})
