import {useRef, useState} from "react";
import {createContainer} from "unstated-next";
import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {ResourceStore} from "../ResourceHandler/ResourceStore.ts";
import {ResourceTypeRaw} from "../ResourceHandler/genericTypes.ts";
import {useToggle} from "../hooks";
import {useWriteToFile} from "@/Resource/context/admin/useWriteToFile.ts";
import {Editable} from "@/Resource/context/admin/Editable.ts";

export type Update = Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;

// const editableResource = new Resource({key: '' as ResourceKeys}) as ResourceClass;

const useAdminBase = (resourceStore?: ResourceStoreClass) => {
  if (!resourceStore) {
    throw new Error("ResourceStore is required but was not provided.");
  }
  // const resourceStore = useRef(new ResourceStore(_resourceStore.state, 'admin')).current;
  const editable = useRef(new Editable(resourceStore)).current;
  // const resourceStore = editable.originalResourceStore!
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const {
    write__initialResources,
    write__removeResource,
    write__addType,
    write__removeType,
  } = useWriteToFile(resourceStore)

  const createResource = (resource: Update) => {
    editable.createResource(resource)
    onOpenAlertDialog()
  }

  const updateResource = (id: string) => {
    editable.updateResource(id)
    onOpenAlertDialog()
  }

  const onOpenAlertDialog = () => {
    setAlertDialogOpen(true);
  }
  const onCloseAlertDialog = () => {
    setAlertDialogOpen(false);
  };

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const onToggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);
  const onCloseAdminPanel = () => setShowAdminPanel(false);

  // console.log(resourceStore)

  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);

  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);

  // ----------------------------------- Checks ---------------------------------------

  const canRemoveResource = (key: ResourceKeys) => {
    return !resourceStore?.isResourceReferenced(key)
  }

  // const isDisabled = useCallback((id: string) => {
  //   if (resourceStore?.get(id)) {
  //     return areObjectsEqual(resourceStore!.get(id).state, resourcesOriginal!.get(id).state)
  //   }
  //   return false
  // }, [resourceStore, resourcesOriginal])


  const onSave = () => {
    const {
      icon,
      ...resourceState
    } = editable.resource;
    // Todo here lies the issue. I want to check for the id since I might want to change the key.
    //  This needs the original clone to inherit this id
    if (editable.isUpdate) {
      const resourceToUpdate = resourceStore.get(editable.origin.id);
      // console.log('update', resourceToUpdate)
      // console.log(resourceStore.resourceReferences(editable.origin.key))
      editable.writeUpdates()
      // resourceToUpdate.setTo(resourceState)
      // const replaceKeys = () => {
      //   resourceStore
      // }
      // _resourceStore.initializeResources(resourceStore.state)
      // write__initialResources()
    }
    if (editable.isCreation) {
      // console.log('create', resourceState)
      resourceStore.addResource(resourceState)
    }

    // if (!(keyAlreadyExists)) {
    //   // resourceStore.addResource(resourceState)
    //   // onSubmit();
    // } else {
    //   // console.log(editable.origin.id, resourceState.id)
    //   // console.log(resourceStore.getByKey(resourceState.key).id)
    //   // console.log(editable.origin)
    //   // console.log(resourceStore.get(editable.origin.id))
    //   console.log(resourceState)
    //   resourceStore.get(editable.origin.id).setTo(resourceState)
    // }
    // write__initialResources()
  }

  return {
    resources: resourceStore as ResourceStore<ResourceKeys, ResourceTypes>,
    canRemoveResource,
    write__addType,
    write__removeType,
    write__removeResource,
    openIconPicker,
    filterUsed,
    handleOpenIconPicker,
    handleCloseIconPicker,
    onToggleFilter,
    showAdminPanel,
    onToggleAdminPanel,
    onCloseAdminPanel,
    alertDialogOpen,
    onCloseAlertDialog,
    onSave,
    editable,
    createResource,
    updateResource,
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;
