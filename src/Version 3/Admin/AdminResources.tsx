import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";
import {ResourceState} from "../../Resource";
import {useAdmin} from "../../Resource/Admin/admin.context.ts";
import {Resource} from "../Resource/Single";
import {Box, Typography} from "@mui/material";
import {AdminResource} from "./AdminResource.tsx";
import {observer} from "mobx-react";

export const AdminResources = () => {
  const {allResources, groupByType} = useAdmin().resources;
  const sortedResources = resourcesByType(allResources);
  console.log(groupByType())
  const types = groupByType()
  return (
    <>
      <Typography variant="h2" align="left" sx={{ml: 4}}>Starting Resources</Typography>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {types.map(({type, resources}) => (
            <ResourceType key={type} type={type} resources={resources}/>
          ))}
        </div>
      </div>
    </>
  )

}

type ResourceTypeProps = {
  type: ResourceTypes;
  resources: Resource<ResourceKeys, ResourceTypes>[]
}

const ResourceType = observer(({type, resources}: ResourceTypeProps) => {
  return (
    <>
      <Box>
        <Typography align="left" variant="h5">{type}</Typography>
      </Box>
      {resources.map(resource => (
        <AdminResource key={resource.key} resource={resource}/>
      ))}
    </>
  )
})


const resourcesByType = (resources: Resource<ResourceKeys, ResourceTypes>[]): Record<ResourceTypes | 'empty', ResourceState<ResourceKeys, ResourceTypes>[]> => {
  return resources.reduce((result, curr) => {
    const type = curr.type || 'empty'
    const value = result[type] || []
    result[type] = value.concat(curr);
    return result
  }, {} as Record<ResourceTypes | 'empty', ResourceState<ResourceKeys, ResourceTypes>[]>);
}