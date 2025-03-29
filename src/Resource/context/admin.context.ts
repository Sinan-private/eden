import {useState} from "react";
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
import {useWriteToFile} from "@/Resource/context/admin/useWriteToFile.ts";
import {useResourceEdit} from "@/Resource/Admin/Resource/new/useResourceEdit.ts";

type Update = Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;

export type EditResourceProps = {
  resource?: Partial<ResourceTypeRaw<ResourceKeys, ResourceTypes>>;
}
const editableResource = new Resource({key: '' as ResourceKeys}) as ResourceClass;

const useAdminBase = () => {
  const [resources, setResources] = useState<ResourceStoreClass>()
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogContent, setAlertDialogContent] = useState<Update>({});
  const {
    write__initialResources,
    write__removeResource,
    write__addType,
    write__removeType,
  } = useWriteToFile(resources)
  // const edit = useResourceEdit(editableResource)
  window.adminResources = resources;

  const onOpenAlertDialog = (resource: Update) => {
    console.log('I guess I somehow need to trigger the state update here?')
    const mergedResource = {...EMPTY_RESOURCE, ...resource}
    setAlertDialogOpen(true);
    setAlertDialogContent(mergedResource);
    editableResource.setTo(mergedResource)
  }
  const onCloseAlertDialog = () => {
    setAlertDialogOpen(false);
    setAlertDialogContent({});
  };
  const {
    fetchResources,
  } = useApi();

  const [isFetching, setIsFetching] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const onToggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);
  const onCloseAdminPanel = () => setShowAdminPanel(false);

  // console.log(resources)

  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);

  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);

  useComponentMount(async () => {
    const rawState = await fetchResources();
    setResources(new ResourceStore(rawState, 'admin.context'));
    setIsFetching(false);
  })

  // ----------------------------------- Checks ---------------------------------------

  const canRemoveResource = (key: ResourceKeys) => {
    return !resources?.isResourceReferenced(key)
  }

  // const isDisabled = useCallback((id: string) => {
  //   if (resources?.get(id)) {
  //     return areObjectsEqual(resources!.get(id).state, resourcesOriginal!.get(id).state)
  //   }
  //   return false
  // }, [resources, resourcesOriginal])


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
    isFetching,
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
    // edit,
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