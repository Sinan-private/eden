import {Resource} from "../Resource/Single";
import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";
import {useAdmin} from "./admin.context.ts";

type AdminSaveProps = {
  onSubmit(): void;
  resource: Resource<ResourceKeys, ResourceTypes>
}
export const AdminSave = ({resource, onSubmit}: AdminSaveProps) => {
  const {getActions} = useAdmin();
  const {onSubmitChanges, saveDisabled} = getActions(resource.id);
  const submitChanges = () => onSubmitChanges(onSubmit)

  return (
    <button onClick={submitChanges} disabled={saveDisabled}>
      Save
    </button>
  )
}
