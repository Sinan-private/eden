import {Resource} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";
import {useAdmin} from "./admin.context.ts";
import {observer} from "mobx-react";

type AdminSaveProps = {
  onSubmit(): void;
  resource: Resource<ResourceKeys, ResourceTypes>
}
export const AdminSave = observer(({resource, onSubmit}: AdminSaveProps) => {
  const {getActions} = useAdmin();
  const {onSubmitChanges, saveDisabled} = getActions(resource.id);
  const submitChanges = () => onSubmitChanges(onSubmit)

  return (
    <button onClick={submitChanges} disabled={saveDisabled}>
      Save
    </button>
  )
})
