import {Typography} from "@mui/material";
import {AdminResource} from "./AdminResource.tsx";
import {useGame} from "../context/game.context.ts";
import {ResourceState} from "../Resource";
import Box from "@mui/material/Box";
import {EditResource} from "./EditResource.tsx";
import {useState} from "react";
import {ResourceKeys, ResourceTypes} from "../Resource/specificTypes.ts";

export const HandleResources = () => {
  const {getByType} = useGame().resources;
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
            <ResourceType key={key} resourceKey={key as ResourceKeys} resource={resourcesByType}/>
          ))}
        </div>
      </div>
    </>
  )
}

type ResourceTypeProps = {
  resourceKey: ResourceKeys;
  resource: ResourceState<ResourceKeys, ResourceTypes>[];
}

const ResourceType = (
  {
    resourceKey,
    resource,
  }: ResourceTypeProps
) => {
  const {get} = useGame().resources;
  const [isAddMode, setIsAddMode] = useState(false);
  const closeAddMode = () => setIsAddMode(false);
  return (
    <Box>
      <Typography align="left" variant="h5" paragraph>{resourceKey}</Typography>
      {resource.map(({key}) => (
        <AdminResource key={key} resource={get(key)}/>
      ))}
      {!isAddMode
      ? <button onClick={() => setIsAddMode(true)}>Add resource</button>
      : (
          <Box maxWidth={1000}>
            <EditResource
              enableKeyEdit
              resource={{type: resource[0].type}}
              onSubmit={closeAddMode}
              onClose={closeAddMode}
            />
          </Box>
        )
      }

      <div style={{height: 60}}/>
    </Box>
  )
}
