import {useRef, useState} from "react";
import {createContainer} from "unstated-next";
import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {ResourceStore} from "@/Resource/ResourceHandler/ResourceStore.ts";
import {ResourceCloneProps} from "@/Resource/ResourceHandler/genericTypes.ts";


const useAdminBase = (resourceStore?: ResourceStoreClass) => {
  if (!resourceStore) {
    throw new Error("ResourceStore is required but was not provided.");
  }
  const editable = useRef(AdminController.getInstance(resourceStore)).current;

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showResourceEdit, setShowResourceEdit] = useState(false);
  const onToggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);
  const onCloseAdminPanel = () => setShowAdminPanel(false);
  const onCloseResourceEdit = () => setShowResourceEdit(false);
  const onResetEdit = () => {
    onCloseResourceEdit();
    editable.resetEditableResource()
  //   And all the resets
  }

  const openNewResource = (raw_resource: ResourceCloneProps<ResourceKeys, ResourceTypes>) => {
    editable.createResource(raw_resource)
    setShowResourceEdit(true)
  }

  const openExistingResource = (id: string) => {
    editable.editResource(id)
    setShowResourceEdit(true)
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
    onResetEdit,
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;

