import {useAdmin} from "./admin.context.ts";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select from "@mui/material/Select";
import {resourceTypes} from "../generated/resourceTypes.ts";
import {Resource} from "../Resource/Single";
import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";

type AdminTypeProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  enableKeyEdit?: boolean;
}
export const AdminType = ({resource, enableKeyEdit}: AdminTypeProps) => {

  const {getActions} = useAdmin();
  const {onSetType} = getActions(resource.id, enableKeyEdit)
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={resource.type}
        label="Type"
        onChange={onSetType}
      >
        {resourceTypes.map((type) => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
