import {Typography} from "@mui/material";
import {AdminResource} from "./AdminResource.tsx";
import {useGame} from "../context/game.context.ts";
import {ResourceKeys, ResourceState, ResourceTypes} from "../Resource/types.ts";
import Box from "@mui/material/Box";
import {EditResource} from "./EditResource.tsx";

export const HandleResources = () => {
  const {get, getByType} = useGame().resources;
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
            <Box key={key}>
              <Typography align="left" variant="h5" paragraph>{key}</Typography>
              {resourcesByType.map(({key}) => (
                <AdminResource key={key} resource={get(key)}/>
              ))}
              <button>Add resource</button>
              <EditResource enableKeyEdit resource={{type: resourcesByType[0].type}} />
            <div style={{height: 60}} />
            </Box>
          ))}
        </div>
      </div>
    </>
  )
}
