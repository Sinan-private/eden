import {ChangeEvent, useState} from "react";
import {createContainer} from "unstated-next";
import {useApi} from "../../context/useApi.ts";
import {useComponentMount} from "../../Resource/hooks/useComponentMount.ts";
import {ResourceKeys, ResourceState, ResourceTypes} from "../../Resource/specificTypes.ts";
import {ResourceStore} from "../Resource/ResourceStore.ts";
import {useToggle} from "../hooks/useToggle.ts";
import {Icon} from "../Resource/Single/genericTypes.ts";
import {Resource} from "../Resource/Single";

const useAdminBase = () => {
  const {
    fetchResources,
    updateResources,
    addType,
    removeType,
  } = useApi();
  const [resourcesOriginal, setResourcesOriginal] = useState<ResourceStore<ResourceKeys, ResourceTypes>>()
  const [resources, setResources] = useState<ResourceStore<ResourceKeys, ResourceTypes>>()
  const [isFetching, setIsFetching] = useState(true);


  // New stuff here

  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [filterUsed, onToggleFilter] = useToggle(false);

  const [isKeyPristine, setIsKeyPristine] = useState(true);
  const handleOpenIconPicker = () => setOpenIconPicker(true);
  const handleCloseIconPicker = () => setOpenIconPicker(false);

  const getActions = (resourceId: string, enableKeyEdit?: boolean) => {
    const resource = resources!.getById(resourceId)!

    const onSelectIcon = (clickedIcon: Icon) => {
      resource.setTo({iconName: clickedIcon.name})
      handleCloseIconPicker()
    }
    const onSetKey = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      resource.setTo({key: e.target.value as ResourceKeys})
      if (isKeyPristine) {
        setIsKeyPristine(false)
      }
    }
    const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      resource.setTo({label: e.target.value})
      if (isKeyPristine && enableKeyEdit) {
        const generatedKey = e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys
        resource.setTo({key: generatedKey})
      }
    }
    const onChange = (change: 'min' | 'max' | 'value') =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        resource.setTo({[change]: Number(e.target.value)})
    const onSetMin = onChange('min');
    const onSetMax = onChange('max');
    const onSetValue = onChange('value');
    const keyAlreadyExists = getKeyAlreadyExists(resources!.allResources, resource);
    const onBlurMax = () => {
      const shouldBeInfinite = (resource?.max || 0) < 1
      if (shouldBeInfinite) {
        resource?.setTo({max: Infinity})
      }
    }
    const onSetType = (e: any) => {
      const _type = e.target.value as ResourceTypes
      resource?.setTo({type: _type})
    }

    const onSubmitChanges = (onSubmit: () => void) => {
      if (!(keyAlreadyExists && enableKeyEdit)) {
        write__initialResources()
        onSubmit();
      }
    }
    const saveDisabled = isDisabled(resource.key) || (enableKeyEdit && keyAlreadyExists) || !resource!.key.length;

    return {
      onSelectIcon,
      onSetKey,
      onSetLabel,
      onSetMin,
      onSetMax,
      onSetValue,
      onBlurMax,
      onSetType,
      onSubmitChanges,
      saveDisabled,
      keyAlreadyExists,
    }
  }


  // End new stuff


  useComponentMount(async () => {
    const rawState = await fetchResources();
    setResources(new ResourceStore(rawState));
    setResourcesOriginal(new ResourceStore(rawState));
    setIsFetching(false);
  })


  const write__initialResources = () => {
    updateResources(resources!.state).then(() => {
      setResourcesOriginal(new ResourceStore(resources!.state))
    })
  }

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

  const canRemoveResource = (key: ResourceKeys) => {
    return !resources?.isResourceReferenced(key)
  }

  const isDisabled = (key: ResourceKeys) => {
    if (resources?.get(key) && resourcesOriginal?.get(key)) {
      return areObjectsEqual(resources!.get(key).state, resourcesOriginal!.get(key).state)
    }
    return false
  }


  return {
    resources: resources as ResourceStore<ResourceKeys, ResourceTypes>,
    isFetching,
    isDisabled,
    canRemoveResource,
    write__addType,
    write__removeType,
    write__removeResource,
    write__initialResources,
    getActions,
    openIconPicker,
    filterUsed,
    handleOpenIconPicker,
    handleCloseIconPicker,
    onToggleFilter,
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
    // @ts-ignore
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