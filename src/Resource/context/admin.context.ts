import {useState} from "react";
import {createContainer} from "unstated-next";
import {ResourceClass, ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {ResourceStore} from "../ResourceHandler/ResourceStore.ts";
import {ResourceTypeRaw} from "../ResourceHandler/genericTypes.ts";
import {Resource} from "../ResourceHandler";
import {useToggle} from "../hooks";
import {useWriteToFile} from "@/Resource/context/admin/useWriteToFile.ts";
import {getKeyAlreadyExists} from "@/Resource/context/admin/equalityChecks.ts";
import {Editable} from "@/Resource/context/admin/Editable.ts";

type Update = Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;

export type EditResourceProps = {
  resourceStore?: Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;
}
const editableResource = new Resource({key: '' as ResourceKeys}) as ResourceClass;

const useAdminBase = (resourceStore?: ResourceStoreClass) => {
  if (!resourceStore) {
    throw new Error("ResourceStore is required but was not provided.");
  }

  // Here I want to store the ID to make everything else just listen to it
  // const [resourceToEdit, setResourceToEdit] = useState('new_resource')

  // const [resources, setResources] = useState<ResourceStoreClass>()
  const editable = new Editable(resourceStore)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState<Update>({});
  const {
    write__initialResources,
    write__removeResource,
    write__addType,
    write__removeType,
  } = useWriteToFile(resourceStore)

  const onOpenAlertDialog = (resource: Update, id?: string) => {
    console.log('I guess I somehow need to trigger the state update here?', id)
    const mergedResource = {...EMPTY_RESOURCE, ...resource}
    setAlertDialogOpen(true);
    setAlertDialogContent(mergedResource);
    editableResource.setTo(mergedResource)
  }
  const onCloseAlertDialog = () => {
    setAlertDialogOpen(false);
    setAlertDialogContent({});
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
    const resource = editableResource as ResourceClass;
    // Todo here lies the issue. I want to check for the id since I might want to change the key.
    //  This needs the original clone to inherit this id
    const keyAlreadyExists = getKeyAlreadyExists(resourceStore!.allResources, resource);
    if (!(keyAlreadyExists)) {
      resourceStore.addResource(resource)
      // onSubmit();
    } else (
      resourceStore.getByKey(editableResource.key).setTo(resource.state)
    )
    write__initialResources()
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
    alertDialogContent,
    onOpenAlertDialog,
    onCloseAlertDialog,
    editableResource,
    onSave,
    editable,
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;

const EMPTY_RESOURCE: Update & {key: ResourceKeys} = {
  label: '',
  key: '' as ResourceKeys,
  value: 0,
  min: 0,
  max: Infinity,
  iconName: 'empty',
  cost: null,
  revealedAt: null,
}