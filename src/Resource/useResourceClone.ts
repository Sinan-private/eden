import {useCallback, useMemo, useState} from "react";
import {ResourceState, TradeChange} from "./genericTypes.ts";
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
  const safeConfig = createConfig(config);
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


  const onSetCost = (
    changeKey: 'give' | 'gain',
    change: TradeChange<K>
  ) => {
    if (!cost) {
      return
    }
    const newCost = _resource.updateCost(changeKey, change, cost)
    setCost(newCost)
  }

  const onAddCost = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>
  ) => {
    if (!cost) {onCreateCost(change)}
    const newCost = _resource.addCost(changeKey, change, cost)
    if (newCost) {
      setCost(newCost)
      safeConfig.onAddCost(getResourceState({cost: newCost}));
    }
  }

  const onCreateCost = (change: TradeChange<K>) => {
    const newResource = new Resource(getResourceState());
    const newCost = newResource.createTrade(change)
    // const newCost: ResourceCostUpdate<K> = get(key).createCost(change);
    console.log(newResource, newCost)

    setCost(newCost)
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

  const onSetRevealedAt = (
    changeKey: 'give' | 'gain',
    change: TradeChange<K>
  ) => {
    if (!revealedAt) {
      return
    }
    const newCost = _resource.updateRevealedAt(changeKey, change, revealedAt)
    setRevealedAt(newCost)
  }

  const onAddRevealedAt = (
    changeKey: 'give' | 'gain' | '',
    change: TradeChange<K>
  ) => {
    const newCost = _resource.addRevealedAt(changeKey, change, cost)
    if (newCost) {
      setRevealedAt(newCost)
      safeConfig.onAddRevealedAt(getResourceState({cost: newCost}));
    }
  }

  const onCreateRevealedAt = (change: TradeChange<K>) => {
    const newResource = new Resource(getResourceState());
    const newCost = newResource.createTrade(change)
    // const newCost: ResourceCostUpdate<K> = get(key).createCost(change);

    setRevealedAt(newCost)
  }

  const onRemoveRevealedAt = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: K
  ) => {
    const newCost = _resource.removeRevealedAt(changeKey, resourceKey, revealedAt)
    if (newCost) {
      setRevealedAt(newCost)
      safeConfig.onRemoveRevealedAt(getResourceState({cost: newCost}));
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

  const isDisabled = useMemo(() => {
    return !(
      key !== resource?.key
      || value !== resource?.value
      || label !== resource?.label
      || type !== resource?.type
      || iconName !== resource?.iconName
      || min !== resource?.min
      || max !== resource?.max
      || JSON.stringify(cost) !== JSON.stringify(resource?.cost)
      || JSON.stringify(revealedAt) !== JSON.stringify(resource?.revealedAt)
    );
  }, [key, value, resource, label, type, iconName, min, max, cost, revealedAt])



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
