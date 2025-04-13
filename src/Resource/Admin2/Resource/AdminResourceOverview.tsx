import {ResourceKeys, ResourceTypes} from "@/Resource";
import {Resource} from "@/Resource/ResourceHandler";
import {observer} from "mobx-react";
import {AlertDialog} from "@/components/ui/alert-dialog.tsx";
import {AdminResource} from "@/Resource/Admin2/Resource/AdminResource.tsx";
import {EditResource} from "@/Resource/Admin2/Resource/EditResource.tsx";
import {AdminController} from "@/Resource/Admin2/AdminController.ts";
import {AddButton} from "@/components/ui/AddButton.tsx";

export const AdminResourceOverview = observer(() => {
  const {cloneResourceStore: resources, showResourceEdit, canEdit} = AdminController.getInstance()
  const {groupByType} = resources;
  const types = groupByType()
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
  const {createResource} = AdminController.getInstance()
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