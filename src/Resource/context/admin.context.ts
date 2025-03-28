import {useCallback, useState} from "react";
import {createContainer} from "unstated-next";
import {
  ResourceClass,
  ResourceKeys,
  ResourceState,
  ResourceStoreClass,
  ResourceTypes
} from "@/Resource";
import {ResourceStore} from "../ResourceHandler/ResourceStore.ts";
import {ResourceTypeRaw} from "../ResourceHandler/genericTypes.ts";
import {Resource} from "../ResourceHandler";
import {useToggle, useComponentMount} from "../hooks";
import {useApi} from "../hooks/useApi.ts";

type Update = Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;

export type EditResourceProps = {
  resource?: Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;
}
const editableResource = new Resource({key: '' as ResourceKeys});

const useAdminBase = () => {
  // const [editableResource] = useState(new Resource({key: '' as ResourceKeys}))
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState<Update>({});

  // console.log('admin key: ', editableResource.key)
  console.log(editableResource.key, editableResource.id)


  const onOpenAlertDialog = (resource: Update = {}) => {
    setAlertDialogOpen(true);
    setAlertDialogContent(resource);
    editableResource.setTo(resource)
  }
  const onCloseAlertDialog = () => {
    setAlertDialogOpen(false);
    setAlertDialogContent({});
  };
  const {
    fetchResources,
    updateResources,
    addType,
    removeType,
  } = useApi();
  const [resourcesOriginal, setResourcesOriginal] = useState<ResourceStoreClass>()
  const [resources, setResources] = useState<ResourceStoreClass>()
  const [isFetching, setIsFetching] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const onToggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);
  const onCloseAdminPanel = () => setShowAdminPanel(false);

  // console.log(resources)

  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);

  const [isKeyPristine, setIsKeyPristine] = useState(true);
  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);

  useComponentMount(async () => {
    const rawState = await fetchResources();
    setResources(new ResourceStore(rawState, 'admin.context'));
    setResourcesOriginal(new ResourceStore(rawState, 'admin.context - original reference'));
    setIsFetching(false);
  })

  const resetResources = () => {
    setResources(new ResourceStore(resourcesOriginal!.state, 'admin.context'))
  }

  // ----------------------------------- Write Resource to file ---------------------------------------

  const write__initialResources = useCallback(() => {
      // console.log(resources?.state.length)
    const state = resources!.state.filter(({key}) => key.length)
    updateResources(state).then(() => {
      // console.log(resources?.state.length)
      setResourcesOriginal(new ResourceStore(state, 'admin.context - original reference'))
    })
  }, [resources, updateResources])

  const write__removeResource = (key: ResourceKeys) => {
    resources?.removeResource(key);
    updateResources(resources!.state)
  }

  const write__addType = (type: string | string[]) =>
    addType(([] as string[]).concat(type))

  const write__removeType = (type: ResourceTypes | ResourceTypes[]) => {
    const usedTypes = resources!.allResources.map(({type}) => type);
    const typesToRemove = ([] as ResourceTypes[]).concat(type);
    const matches = typesToRemove.filter(value => usedTypes.includes(value!));
    if (matches.length) {
      console.error('These Types are being in used and can not be removed', matches)
      return;
    }
    removeType(typesToRemove)
  }

  // ----------------------------------- Checks ---------------------------------------

  const canRemoveResource = (key: ResourceKeys) => {
    return !resources?.isResourceReferenced(key)
  }

  const isDisabled = useCallback((id: string) => {
    if (resources?.get(id) && resourcesOriginal?.get(id)) {
      return areObjectsEqual(resources!.get(id).state, resourcesOriginal!.get(id).state)
    }
    return false
  }, [resources, resourcesOriginal])

  // Todo this needs to be checked


  const onSave = () => {
    const resource = editableResource as ResourceClass;
    const resourceStore = resources as ResourceStore<ResourceKeys, ResourceTypes>
    // Todo here lies the issue. I want to check for the id since I might want to change the key.
    //  This needs the original clone to inherit this id
    const keyAlreadyExists = getKeyAlreadyExists(resources!.allResources, resource);
    if (!(keyAlreadyExists)) {
      resourceStore.addResource(resource)
      // onSubmit();
    } else (
      resourceStore.getByKey(editableResource.key).setTo(resource.state)
    )
    write__initialResources()
  }

  return {
    resources: resources as ResourceStore<ResourceKeys, ResourceTypes>,
    resourcesOriginal: resourcesOriginal as ResourceStore<ResourceKeys, ResourceTypes>,
    isFetching,
    isDisabled,
    canRemoveResource,
    write__addType,
    write__removeType,
    write__removeResource,
    write__initialResources,
    // getActions,
    openIconPicker,
    filterUsed,
    handleOpenIconPicker,
    handleCloseIconPicker,
    onToggleFilter,
    showAdminPanel,
    onToggleAdminPanel,
    onCloseAdminPanel,
    resetResources,
    alertDialogOpen,
    alertDialogContent,
    onOpenAlertDialog,
    onCloseAlertDialog,
    editableResource,
    onSave,
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;

const areObjectsEqual = <K extends string>(obj1: ResourceState, obj2?: Partial<ResourceState>): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1) as K[];
  const keys2 = Object.keys(obj2) as K[];

  for (const key of keys1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const getKeyAlreadyExists = (
  resources: Resource<ResourceKeys, ResourceTypes>[],
  resource: Resource<ResourceKeys, ResourceTypes>
) => resources
  .filter(({id}) => id !== resource?.id)
  .map(({key}) => key)
  .includes(resource?.key as ResourceKeys);