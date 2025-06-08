import {ResourceState, ResourceTypes} from "src/GameEngine";

export const fetchResources = async () => {
  try {
    const response = await fetch('/api/resources');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
};

export const fetchResourceKeys = async () => {
  try {
    const response = await fetch('/api/resource_keys');  // This will proxy to http://localhost:5001/resources
    return await response.json();
  } catch (error) {
    console.error('Error fetching resourceKeys:', error);
  }
}

export const fetchResourceTypes = async () => {
  try {
    const response = await fetch('/api/types');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resourceKeys:', error);
  }
}


export const addType = async (type: string[]) => {
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

export const removeType = async (type: ResourceTypes[]) => {
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

export const updateResources = async (newResources?: ResourceState[]) => {
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

export const updateResourceKeys = async (newKeys: ResourceState[]) => {
  try {
    const response = await fetch('/api/add_resource_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newKeys),
    });
    const result = await response.json();

    console.log(result.message);  // Success message
  } catch (error) {
    console.error('Error updating resourceKeys:', error);
  }
}
