import {useRef, useState} from "react";
import {createContainer} from "unstated-next";
import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {AdminUser} from "@/Resource/Admin2/AdminUser.ts";
import {ResourceStore} from "@/Resource/ResourceHandler/ResourceStore.ts";


const useAdminBase = (resourceStore?: ResourceStoreClass) => {
  if (!resourceStore) {
    throw new Error("ResourceStore is required but was not provided.");
  }
  const editable = useRef(new AdminUser(resourceStore)).current;

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showResourceEdit, setShowResourceEdit] = useState(false);
  const onToggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);
  const onCloseAdminPanel = () => setShowAdminPanel(false);

  const openNewResource = (type: ResourceTypes) => {
    console.log('click openNewResource', type)
  }

  const openExistingResource = (id: string) => {
    console.log('click openExistingResource', id)
  }

  return {
    resources: editable.cloneResourceStore as ResourceStore<ResourceKeys, ResourceTypes>,
    editable,
    showAdminPanel,
    onToggleAdminPanel,
    onCloseAdminPanel,
    showResourceEdit,
    openNewResource,
    openExistingResource,
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;

