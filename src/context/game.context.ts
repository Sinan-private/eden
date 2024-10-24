import {useEffect, useState} from "react";
import {createContainer} from "unstated-next";
import {useTick} from "./tick.ts";
import {usePrevious} from "../Resource/hooks/usePrevious.ts";
import {Resource, ResourceState, ResourceUpdateProps, useResource} from "../Resource";
import {getResourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";
import {useApi} from "./useApi.ts";
import {useComponentMount} from "../Resource/hooks/useComponentMount.ts";
import {ResourceKeys, ResourceTypes} from "../Resource/types.ts";

const useGameBase = () => {
  const {
    fetchResources,
    updateResources,
    addType,
    removeType,
  } = useApi();
  const [isFetching, setIsFetching] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  // The resource offers all info and update methods. The nextTurn is only needed here to handle turn updates only in here.
  const {nextTurn, setState, ...resources} = useResource<ResourceKeys, ResourceTypes>([]);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);
  useComponentMount(async () => {
    const rawState = await fetchResources();
    setState(getInitialState(rawState));
    setIsFetching(false);
  })

  const onOpenAdminPanel = () => setShowAdminPanel(true);
  const onCloseAdminPanel = () => setShowAdminPanel(false);

  // With every tick a new turn is triggered with all included production
  useEffect(() => {
    const {isActive, current} = tick;
    const isNextTurn = isActive && prevTick !== current;
    if (isNextTurn) {
      nextTurn(getResourceTurnUpdate)
    }
  }, [tick, prevTick, nextTurn]);

  const writeInitialResources = (newState?: ResourceState<ResourceKeys, ResourceTypes>[]) => {
    if (!newState) return;
    updateResources(newState).then(() => (
      setState(newState)
    ))
  }

  const writeAddType = (type: string | string[]) =>
    addType(([] as string[]).concat(type))

  const writeRemoveType = (type: ResourceTypes | ResourceTypes[]) => {
    const usedTypes = resources.getByType().map(({type}) => type);
    const typesToRemove = ([] as ResourceTypes[]).concat(type);
   const matches =  typesToRemove.filter(value => usedTypes.includes(value!));
   if (matches.length) {
     console.error('These Types are being in used and can not be removed', matches)
     return;
   }
   removeType(typesToRemove)
  }

  return {
    resources,
    isFetching,
    tick,
    writeInitialResources,
    showAdminPanel,
    // setShowAdminPanel,
    onOpenAdminPanel,
    onCloseAdminPanel,
    writeAddType,
    writeRemoveType,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;

const getInitialState = (raw_state: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]) => raw_state.map(rawResource =>
  new Resource(rawResource).state
);
