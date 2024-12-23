import {ResourceTypes, ResourceState} from "../ResourceHandling";

export const useApi = () => {
  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');  // This will proxy to http://localhost:5001/resources
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const updateResources = async (newResources?: ResourceState[]) => {
    if (!newResources) return;
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

  const addType = async (type: string[]) => {
    try {
      const response = await fetch('/api/add_type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(type),
      });
      const result = await response.json();
      console.log(result.message);  // Success message
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  }

  const removeType = async (type: ResourceTypes[]) => {
    try {
      const response = await fetch('/api/remove_type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(type),
      });
      const result = await response.json();
      console.log(result.message);  // Success message
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  }

  return {
    fetchResources,
    updateResources,
    addType,
    removeType,
  }
}
