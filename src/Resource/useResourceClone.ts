import {useGame} from "../context/game.context.ts";
import {ChangeEvent, useMemo, useState} from "react";
import {ResourceState, TradeChange} from "./types.ts";
import {SelectChangeEvent} from "@mui/material/Select";
import icons from "../assets/icons/icons.ts";
import {Resource} from "./Resource.ts";

export type ResourceCloneConfig<K, T> = {
  onAddCost(resourceState: ResourceState<K, T>): void;
  onRemoveCost(resourceState: ResourceState<K, T>): void;
}

export const useResourceClone = <K extends string, T extends string>(
  resource: Partial<ResourceState<K, T>>,
  config?: Partial<ResourceCloneConfig<K, T>>
) => {
  const _resource = new Resource(resource as ResourceState<K, T>)
  const {
    resources: {
      mergeChangeToState,
    },
    writeInitialResources
  } = useGame();
  const safeConfig = createConfig(config);
  const [key, setKey] = useState(_resource.key!)
  const [min, setMin] = useState(_resource.min)
  const [max, setMax] = useState(_resource.max)
  const [value, setValue] = useState(_resource.value)
  const [label, setLabel] = useState(_resource.label)
  const [type, setType] = useState(_resource.type);
  const [iconName, setIconName] = useState(_resource.iconName);
  const [cost, setCost] = useState(_resource.cost);

  const getResourceState = (update?: Partial<ResourceState<K, T>>): ResourceState<K, T> => ({
    key,
    min,
    max,
    type,
    value,
    label,
    iconName,
    cost,
    ...update,
  })


  const onSetCost = (
    changeKey: 'give' | 'gain',
    change: TradeChange<K>
  ) => {
    if (!cost) {
      return
    }
    const newCost = _resource.updateCost(changeKey, change)
    setCost(newCost)
  }

  const onAddCost = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>
  ) => {
    const newCost = _resource.addCost(changeKey, change, cost)
    if (newCost) {
      setCost(newCost)
      safeConfig.onAddCost(getResourceState({cost: newCost}));
    }
  }

  const onRemoveCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K
  ) => {
    const newCost = _resource.removeCost(changeKey, resourceKey, cost)
    if (newCost) {
      setCost(newCost)
      safeConfig.onRemoveCost(getResourceState({cost: newCost}));
    }
  }

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as T);
  };

  const updateResource = () => {
    // @ts-ignore
    const newState = mergeChangeToState(getResourceState())
    writeInitialResources(newState)
  }

  const isDisabled = useMemo(() => {
    return !(
      value !== resource.value
      || label !== resource.label
      || type !== resource.type
      || iconName !== resource.iconName
      || JSON.stringify(cost) !== JSON.stringify(resource.cost)
    );
  }, [value, label, type, iconName, resource, cost])

  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLabel(e.target.value)
  const onSetValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(Number(e.target.value))

  const icon = icons.find(({name}) => name === iconName)?.src || '';

  return {
    key,
    min,
    max,
    value,
    label,
    type,
    cost,
    icon,
    isDisabled,
    onSetCost,
    onAddCost,
    handleTypeChange,
    updateResource,
    onSetLabel,
    onSetValue,
    onRemoveCost,
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
  }
  return {
    ...defaultConfig,
    ...config,
  }
}
