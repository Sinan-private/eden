import {Typography} from "@mui/material";
import {AdminResource} from "./AdminResource.tsx";
import {ResourceState} from "../../index.ts";
import Box from "@mui/material/Box";
import {useState} from "react";
import {ResourceKeys, ResourceTypes} from "../../specificTypes.ts";
import {useAdmin} from "../../../Version 3/Admin/admin.context.ts";
import EditResource from "./EditResource";
import {useComponentMount} from "../../hooks/useComponentMount.ts";
import {observer} from "mobx-react";

export const HandleResources = () => {
  const {getByType} = useAdmin().resources;
  const _sortedResources = getByType().reduce((result, curr) => {
    const type = curr.type || 'empty'
    const value = result[type] || []
    result[type] = value.concat(curr);
    return result
  }, {} as Record<ResourceTypes | 'empty', ResourceState<ResourceKeys, ResourceTypes>[]>);

  return (
    <>
      <Typography variant="h2" align="left" sx={{ml: 4}}>Starting Resources</Typography>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {Object.entries(_sortedResources).map(([key, resourcesByType]) => (
            <ResourceType key={key} resourceKey={key as ResourceKeys} resources={resourcesByType}/>
          ))}
        </div>
      </div>
    </>
  )
}

type ResourceTypeProps = {
  resourceKey: ResourceKeys;
  resources: ResourceState<ResourceKeys, ResourceTypes>[];
}

const ResourceType = (
  {
    resourceKey,
    resources,
  }: ResourceTypeProps
) => {
  const {get} = useAdmin().resources;
  const [isAddMode, setIsAddMode] = useState(false);
  const closeAddMode = () => setIsAddMode(false);
  return (
    <Box>
      <Typography align="left" variant="h5">{resourceKey}</Typography>
      {resources.map(({key}) => (
        <AdminResource key={key} resource={get(key)}/>
      ))}
      {!isAddMode
        ? <button onClick={() => setIsAddMode(true)}>Add resource</button>
        : <AddResource closeAddMode={closeAddMode} />
      }

      <div style={{height: 60}}/>
    </Box>
  )
}

const AddResource = observer(({closeAddMode}: {closeAddMode: () => void}) => {
  const {get, addResource} = useAdmin().resources;
  useComponentMount(() => addResource({key: 'empty' as ResourceKeys}));
  const resource = get('empty' as ResourceKeys);
  if (!resource) return null;

  return (
    <Box maxWidth={1000}>
      <EditResource
        enableKeyEdit
        id={resource.id}
        onSubmit={closeAddMode}
        onClose={closeAddMode}
      />
    </Box>
  )
})