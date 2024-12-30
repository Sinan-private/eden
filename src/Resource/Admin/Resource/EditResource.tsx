import {Box} from "@mui/material";
import {observer} from "mobx-react";
import {Resource} from "../../ResourceHandler";
import {ResourceKeys, ResourceTypes} from "../../ResourceHandler/specificTypes.ts";
import {AdminCost} from "./AdminCost.tsx";
import {AdminType} from "./AdminType.tsx";
import {AdminAmounts} from "./AdminAmounts.tsx";
import {AdminNameAndIcon} from "./AdminNameAndIcon.tsx";
import {AdminGenerics} from "./AdminGenerics.tsx";
import {useEffect} from "react";
import {useAdmin} from "../../context/admin.context.ts";

type EditResourceProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  onClose(): void;
  onSubmit(): void;
  enableKeyEdit?: boolean
}

export const EditResource = observer(({resource, onClose, onSubmit, enableKeyEdit}: EditResourceProps) => {
  const {getActions, resources} = useAdmin();
  const {onSubmitChanges, saveDisabled} = getActions(resource);
  const submitChanges = () => {
    resources.addEditableResource()
    onSubmitChanges(onSubmit)
  }
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !saveDisabled) {
        submitChanges()
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveDisabled, submitChanges]);
  return (
    <>
      <Box position="relative" pt={4} display="flex" gap={4}>
        <AdminGenerics onClose={onClose} enableKeyEdit={enableKeyEdit} resource={resource} />
        <AdminNameAndIcon resource={resource} enableKeyEdit={enableKeyEdit} />
        <AdminAmounts resource={resource} enableKeyEdit={enableKeyEdit} />
        <AdminType resource={resource} enableKeyEdit={enableKeyEdit} />
        <Save saveDisabled={saveDisabled} submitChanges={submitChanges} />
      </Box>
      <AdminCost resource={resource}/>
    </>
  )
})

type SaveProps = {
  saveDisabled: boolean;
  submitChanges(): void;
}

const Save = ({saveDisabled, submitChanges}: SaveProps) => (
  <button onClick={submitChanges} disabled={saveDisabled}>
    Save
  </button>
)