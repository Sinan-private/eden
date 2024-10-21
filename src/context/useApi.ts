export const useApi = () => {
  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');  // This will proxy to http://localhost:5001/resources
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const updateResources = async (newResources: any) => {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResources),
      });
      const result = await response.json();
      console.log(result.message);  // Success message
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  };

  // NOT Working!!!
  const fetchIcons = async () => {
    try {
      const response = await fetch('/api/icons');  // This will proxy to http://localhost:5001/resources
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  return {
    fetchResources,
    updateResources,
    fetchIcons,
  }
}

// Todo This is some ugly shit that should not happen. Needs refactoring to have a clean way to provide resources
// As a clean state that can also be stored and an enriched version to handle the state in Components
// const cleanResourcesForStorage = (
//   resources: (ResourceState<ResourceKeys, ResourceTypes> | Resource<ResourceKeys, ResourceTypes> | ResourceBase<ResourceKeys, ResourceTypes>)[]
// ): ResourceState<ResourceKeys, ResourceTypes>[] => {
//   return resources.map(resource => {
//     const x = (resource as Resource<ResourceKeys, ResourceTypes>).state;
//     const _resource: ResourceState<ResourceKeys, ResourceTypes> = x ? x : resource
//     return new ResourceBase(_resource).state
//   })
// }