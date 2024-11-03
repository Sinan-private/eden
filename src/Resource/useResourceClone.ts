import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {ResourceCostUpdate, ResourceState, TradeChange} from "./genericTypes.ts";
import {SelectChangeEvent} from "@mui/material/Select";
import icons from "./assets/icons/icons.ts";
import {Resource} from "./Resource.ts";
import {useAdmin} from "./Admin/admin.context.ts";

export type ResourceCloneConfig<K, T> = {
  onAddCost(resourceState: ResourceState<K, T>): void;
  onRemoveCost(resourceState: ResourceState<K, T>): void;
  onAddRevealedAt(resourceState: ResourceState<K, T>): void;
  onRemoveRevealedAt(resourceState: ResourceState<K, T>): void;
}

export const useResourceClone = <K extends string, T extends string>(
  resource?: Partial<ResourceState<K, T>>,
  config?: Partial<ResourceCloneConfig<K, T>>
) => {
  const _resource = new Resource<K, T>(resource as ResourceState<K, T>)
  const {
    write__initialResources,
    resources: {
      mergeChangeToState,
    }
  } = useAdmin();
  const callbacks = createConfig(config);
  const [key, setKey] = useState(_resource.key!)
  const [min, setMin] = useState(_resource.min)
  const [max, setMax] = useState(_resource.max)
  const [value, setValue] = useState(_resource.value)
  const [label, setLabel] = useState(_resource.label)
  const [type, setType] = useState(_resource.type);
  const [iconName, setIconName] = useState(_resource.iconName);
  const [cost, setCost] = useState(_resource.cost);
  const [revealedAt, setRevealedAt] = useState(_resource.revealedAt);

  const getResourceState = useCallback((update?: Partial<ResourceState<K, T>>): ResourceState<K, T> => ({
    key,
    min,
    max,
    type,
    value,
    label,
    iconName,
    cost,
    revealedAt,
    ...update,
  }), [cost, iconName, key, label, max, min, revealedAt, type, value])

  const onSetTrade = (
    setState: Dispatch<SetStateAction<ResourceCostUpdate<K> | null>>,
    trade?: ResourceCostUpdate<K> | null
  ) => (
    changeKey: 'give' | 'gain',
    change: TradeChange<K>
  ) => {
    if (!trade) {
      return
    }
    const newCost = _resource.updateTrade(changeKey, change, trade)
    setState(newCost)
  }

  const onCreateTrade = (setState: Dispatch<SetStateAction<ResourceCostUpdate<K> | null>>) => (change: TradeChange<K>) => {
    const newResource = new Resource(getResourceState());
    const newCost = newResource.createTrade(change)
    setState(newCost)
  }

  // This gets hideous because of the callback that offers the possibility to close the component after saving
  // const onAddTrade= (
  //   setState: Dispatch<SetStateAction<ResourceCostUpdate<K> | null>>,
  //   trade?: ResourceCostUpdate<K> | null
  // ) => (
  //   changeKey: 'give' | 'gain' | '',
  //   change: TradeChange<K>
  // ) => {
  //   if (!trade) {
  //     onCreateTrade(setState)(change)
  //   }
  //   const newTrade = _resource.addTrade(changeKey, change, trade)
  //   if (newTrade) {
  //     setState(newTrade)
  //     // callbacks.onAddCost(getResourceState({cost: newTrade}));
  //   }
  // }

  const onSetCost = onSetTrade(setCost, cost)
  const onSetRevealedAt = onSetTrade(setRevealedAt, revealedAt)

  const onAddCost = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>
  ) => {
    if (!cost) {
      onCreateCost(change)
    }
    const newCost = _resource.addCost(changeKey, change, cost)
    if (newCost) {
      setCost(newCost)
      callbacks.onAddCost(getResourceState({cost: newCost}));
    }
  }

  const onCreateCost = onCreateTrade(setCost);
  const onCreateRevealedAt = onCreateTrade(setRevealedAt);

  const onRemoveCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K
  ) => {
    const newCost = _resource.removeCost(changeKey, resourceKey, cost)
    if (newCost) {
      setCost(newCost)
      callbacks.onRemoveCost(getResourceState({cost: newCost}));
    }
  }

  const onAddRevealedAt = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>
  ) => {
    const newCost = _resource.addRevealedAt(changeKey, change, revealedAt)
    if (newCost) {
      setRevealedAt(newCost)
      callbacks.onAddRevealedAt(getResourceState({cost: newCost}));
    }
  }

  const onRemoveRevealedAt = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K
  ) => {
    const newCost = _resource.removeRevealedAt(changeKey, resourceKey, revealedAt)
    if (newCost) {
      setRevealedAt(newCost)
      callbacks.onRemoveRevealedAt(getResourceState({cost: newCost}));
    }
  }

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as T);
  };

  const updateResource = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const newState = mergeChangeToState(getResourceState())
    write__initialResources(newState)
  }

  const isDisabled = areObjectsEqual(getResourceState(), resource)
  const icon = icons.find(({name}) => name === iconName)?.src || '';

  return {
    key,
    min,
    max,
    value,
    label,
    type,
    cost,
    revealedAt,
    icon,
    isDisabled,
    onSetCost,
    onAddCost,
    onCreateCost,
    onRemoveCost,
    onSetRevealedAt,
    onAddRevealedAt,
    onCreateRevealedAt,
    onRemoveRevealedAt,
    handleTypeChange,
    updateResource,
    setLabel,
    setValue,
    setIconName,
    setKey,
    setMin,
    setMax,
  }
}

const createConfig = <K, T>(config?: Partial<ResourceCloneConfig<K, T>>): ResourceCloneConfig<K, T> => {
  const empty = () => {};
  const defaultConfig: Record<keyof ResourceCloneConfig<K, T>, () => void> = {
    onAddCost: empty,
    onRemoveCost: empty,
    onAddRevealedAt: empty,
    onRemoveRevealedAt: empty,
  }
  return {
    ...defaultConfig,
    ...config,
  }
}


const areObjectsEqual = <K extends string, T extends string>(obj1: ResourceState<K, T>, obj2?: Partial<ResourceState<K, T>>): boolean => {
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
