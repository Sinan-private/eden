import {useState} from "react";
import {observer} from "mobx-react";
import {ResourceKeys, ResourceTypes} from "@/Resource";
import {useAdmin} from "../../context/admin.context.ts";
import {Resource} from "../../ResourceHandler";
import {AdminResource} from "./new/AdminResourceNew.tsx";
import {EditResource} from "./EditResource.tsx";
import {useComponentMount} from "../../hooks";

export const AdminResources = observer(() => {
  const {groupByType} = useAdmin().resources;
  const types = groupByType()
  return (
    <>
      <h2 className="ml-4">Starting Resources</h2>
      <div className="flex justify-center flex-row" style={{maxWidth: 1100}}>
        <div className="card">
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

  return (
    <>
      <div>
        <h5 className="align text-left">{type}</h5>
      </div>
      <div className="flex gap-2 flex-wrap">

      {resources.map(resource => (
        <AdminResource key={resource.key} resource={resource}/>
      ))}
      </div>
      {!isAddMode
        ? <button onClick={onOpenAddMode}>{label}</button>
        : <AddResource closeAddMode={onCloseAddMode} type={type} />
      }
    </>
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
      <EditResource
        enableKeyEdit
        resource={newResource}
        onSubmit={onSubmit}
        onClose={closeAddMode}
      />
    </div>
  )
})
