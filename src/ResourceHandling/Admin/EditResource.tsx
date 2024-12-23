import {Box} from "@mui/material";
import {observer} from "mobx-react";
import {Resource} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../Resource/specificTypes.ts";
import {AdminCost} from "./AdminCost.tsx";
import {AdminSave} from "./AdminSave.tsx";
import {AdminType} from "./AdminType.tsx";
import {AdminAmounts} from "./AdminAmounts.tsx";
import {AdminNameAndIcon} from "./AdminNameAndIcon.tsx";
import {AdminGenerics} from "./AdminGenerics.tsx";

type EditResourceProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  onClose(): void;
  onSubmit(): void;
  enableKeyEdit?: boolean
}

export const EditResource = observer(({resource, onClose, onSubmit, enableKeyEdit}: EditResourceProps) => {
  return (
    <>
      <Box position="relative" pt={4} display="flex" gap={4}>
        <AdminGenerics onClose={onClose} enableKeyEdit={enableKeyEdit} resourceId={resource.id} />
        <AdminNameAndIcon resource={resource} enableKeyEdit={enableKeyEdit} />
        <AdminAmounts resource={resource} enableKeyEdit={enableKeyEdit} />
        <AdminType resource={resource} enableKeyEdit={enableKeyEdit} />
        <AdminSave resource={resource} onSubmit={onSubmit} />
      </Box>
      <AdminCost resource={resource}/>
    </>
  )
})
