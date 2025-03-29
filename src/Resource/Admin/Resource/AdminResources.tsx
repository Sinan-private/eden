import {useState} from "react";
import {observer} from "mobx-react";
import {ResourceKeys, ResourceTypes} from "@/Resource";
import {useAdmin} from "../../context/admin.context.ts";
import {Resource} from "../../ResourceHandler";
import {AdminResource} from "./new/AdminResourceNew.tsx";
import {useComponentMount} from "../../hooks";
import { PlusCircle } from "@mynaui/icons-react";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {EditResource} from "@/Resource/Admin/Resource/new/EditResourceNew.tsx";


export const AdminResources = observer(() => {
  const {groupByType} = useAdmin().resources;
  const types = groupByType()
  return (
    <>
      <h3 className="mb-6">Starting Resources</h3>
      <div className="flex justify-center flex-row" style={{maxWidth: 1100}}>
        <div className="flex flex-col gap-12">
          {types.map(({type, resources}) => (
            <ResourceType key={type} type={type} resources={resources} label={"Add " + type}/>
          ))}
          <div style={{height: 20}} />
         <ResourceType type={'' as ResourceTypes} resources={[]}/>
        </div>
      </div>
    </>
  )
})

type ResourceTypeProps = {
  type: ResourceTypes;
  resources: Resource<ResourceKeys, ResourceTypes>[];
  label?: string;
}

const ResourceType = observer(({type, resources, label = "Add resource"}: ResourceTypeProps) => {
  const [isAddMode, setIsAddMode] = useState(false);
  const onOpenAddMode = () => setIsAddMode(true);
  const onCloseAddMode = () => setIsAddMode(false);
  const _type = typeToLabel(type)

  return (
    <AlertDialog>
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <h5 className="align text-left font-bold">{_type}</h5>
        <AlertDialogTrigger asChild>

        <PlusCircle
          className="text-2xl text-gray-500 hover:text-gray-100 transition cursor-pointer" />
        </AlertDialogTrigger>
      </div>
      <div className="flex gap-2 flex-wrap">

      {resources.map(resource => (
        <AdminResource key={resource.key} resource={resource}/>
      ))}
      </div>
    </div>
    </AlertDialog>
  )
})

type AddResourceProps = {
  type: ResourceTypes;
  closeAddMode: () => void;
}

const AddResource = observer(({closeAddMode, type}: AddResourceProps) => {
  const {newResource} = useAdmin().resources;
  useComponentMount(() => {
    newResource.setTo({type})
  })
  const onSubmit = () => {
    closeAddMode()
  }

  return (
    <div style={{maxWidth: 1000}}>
      {/*<EditResource*/}
      {/*  enableKeyEdit*/}
      {/*  resource={newResource}*/}
      {/*  onSubmit={onSubmit}*/}
      {/*  onClose={closeAddMode}*/}
      {/*/>*/}
    </div>
  )
})

const typeToLabel = (type: string) => {
  return type
    .replace(/_([a-z])/g, (_, letter) => " " + letter.toUpperCase()) // Convert underscores to spaces and capitalize
    .replace(/^([a-z])/, (_, letter) => letter.toUpperCase()); // Capitalize the first letter

}