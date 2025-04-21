import {ResourceKeys, ResourceTypes} from "@/GameController/Resource";
import {Resource} from "@/GameController/Resource/ResourceHandler";
import {observer} from "mobx-react";
import {AlertDialog} from "@/GameController/components/ui/alert-dialog.tsx";
import {AdminResource} from "@/GameController/Resource/Admin/Resource/AdminResource.tsx";
import {EditResource} from "@/GameController/Resource/Admin/Resource/Edit/EditResource.tsx";
import {AddButton} from "@/GameController/components/ui/AddButton.tsx";
import {game} from "@/Game/Classes/Game";

export const AdminResourceOverview = observer(() => {
  const {cloneResourceStore: resources, showResourceEdit, canEdit} = game().admin
  const {getResourcesByType} = resources;
  const types = getResourcesByType()
  return (
    <AlertDialog open={showResourceEdit}>
      <h3 className="mb-6">Starting Resources</h3>
      <div className="flex justify-center flex-row" style={{maxWidth: 1100}}>
        <div className="flex flex-col gap-12">
          {types.map(({type, resources}) => (
            <ResourceType key={type} type={type} resources={resources} label={"Add " + type}/>
          ))}
          <div style={{height: 20}}/>
          <ResourceType type={'' as ResourceTypes} resources={[]}/>
        </div>
      </div>
      {canEdit &&
        <EditResource />
      }
    </AlertDialog>
  )
})

type ResourceTypeProps = {
  type: ResourceTypes;
  resources: Resource<ResourceKeys, ResourceTypes>[];
  label?: string;
}

const ResourceType = observer(({type, resources}: ResourceTypeProps) => {
  const {createResource} = game().admin
  const _type = typeToLabel(type)

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <h5 className="align text-left font-bold">{_type}</h5>
          <AddButton onClick={() => createResource({type})} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {resources.map(resource => (
            <AdminResource key={resource.id} resource={resource}/>
          ))}
        </div>
      </div>
    </>
  )
})

const typeToLabel = (type: string) => {
  return type
    .replace(/_([a-z])/g, (_, letter) => " " + letter.toUpperCase()) // Convert underscores to spaces and capitalize
    .replace(/^([a-z])/, (_, letter) => letter.toUpperCase()); // Capitalize the first letter
}