import {ResourceKeys, ResourceTypes} from "../../ResourceHandler/specificTypes.ts";
import {useAdmin} from "../../context/admin.context.ts";
import {Resource} from "../../ResourceHandler";
import {Box, Typography} from "@mui/material";
import {AdminResource} from "./AdminResource.tsx";
import {observer} from "mobx-react";
import {useState} from "react";
import {EditResource} from "./EditResource.tsx";
import {useComponentMount} from "../../hooks";

export const AdminResources = observer(() => {
  const {groupByType} = useAdmin().resources;
  const types = groupByType()
  return (
    <>
      <Typography variant="h2" align="left" sx={{ml: 4}}>Starting Resources</Typography>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
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
      <Box>
        <Typography align="left" variant="h5">{type}</Typography>
      </Box>
      {resources.map(resource => (
        <AdminResource key={resource.key} resource={resource}/>
      ))}
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
  const {newResource, addEditableResource} = useAdmin().resources;
  useComponentMount(() => {
    newResource.setTo({type})
  })
  const onSubmit = () => {
    addEditableResource()
    closeAddMode()
  }

  return (
    <Box maxWidth={1000}>
      <EditResource
        enableKeyEdit
        resource={newResource}
        onSubmit={onSubmit}
        onClose={closeAddMode}
      />
    </Box>
  )
})
