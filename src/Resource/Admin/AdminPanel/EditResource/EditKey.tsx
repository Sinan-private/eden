import {TextField} from "@mui/material";
import {ResourceKeys} from "../../../specificTypes.ts";
import {ChangeEvent} from "react";
import {useAdmin} from "../../admin.context.ts";
import {observer} from "mobx-react";

type EditKeyProps = {
  id: string;
  enableKeyEdit?: boolean;
}

export const EditKey = observer((
  {
    id,
    enableKeyEdit,
  }: EditKeyProps) => {
  const {getById, allResources} = useAdmin().resources;
  const resource = getById(id)!
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resource.setTo({key: e.target.value as ResourceKeys})
  }
  const keyAlreadyExists = allResources.map(({key}) => key).includes(resource?.key || '');
  console.log(enableKeyEdit)

  return (
    <TextField
      type="text"
      label="Key"
      value={resource.key}
      onChange={onChange}
      disabled={!enableKeyEdit}
      error={enableKeyEdit && keyAlreadyExists}
    />
  )
})