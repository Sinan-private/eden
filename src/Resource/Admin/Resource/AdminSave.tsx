import {Resource} from "../../ResourceHandler";
import {ResourceKeys, ResourceTypes} from "../../ResourceHandler/specificTypes.ts";
import {useAdmin} from "../../context/admin.context.ts";
import {observer} from "mobx-react";

type AdminSaveProps = {
  onSubmit(): void;
  resource: Resource<ResourceKeys, ResourceTypes>
}
export const AdminSave = observer(({resource, onSubmit}: AdminSaveProps) => {
  const {getActions} = useAdmin();
  const {onSubmitChanges, saveDisabled} = getActions(resource);
  const submitChanges = () => onSubmitChanges(onSubmit)

  return (
    <button onClick={submitChanges} disabled={saveDisabled}>
      Save
    </button>
  )
})
