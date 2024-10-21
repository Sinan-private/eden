import {useEffect} from "react";
import {createContainer} from "unstated-next";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {Resource, ResourceState, ResourceUpdateProps, useResource} from "../Resource";
import {getResourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";
import {useApi} from "./useApi.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {useComponentMount} from "../hooks/useComponentMount.ts";

const useGameBase = () => {
  const {fetchResources, updateResources} = useApi();
  // The resource offers all info and update methods. The nextTurn is only needed here to handle turn updates only in here.
  const {nextTurn, setState, getState, ...resources} = useResource<ResourceKeys, ResourceTypes>([]);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);
  useComponentMount(async () => {
    const rawState = await fetchResources();
    setState(getInitialState(rawState))
  })


  // fetchResources();
  // updateResources([
  //   { id: 1, name: 'Gold', quantity: 1200 },
  //   { id: 2, name: 'Wood', quantity: 600 }
  // ]);

  // With every tick a new turn is triggered with all included production
  useEffect(() => {
    const {isActive, current} = tick;
    const isNextTurn = isActive && prevTick !== current;
    if (isNextTurn) {
      nextTurn(getResourceTurnUpdate)
    }
  }, [tick, prevTick, nextTurn]);

  const writeInitialResources = (newState?: ResourceState<ResourceKeys, ResourceTypes>[]) => {
    console.log(getState(newState))
    updateResources(getState(newState)).then(() => (
      setState(getState(newState))
    ))
  }

  return {
    resources,
    tick,
    writeInitialResources
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;

const getInitialState = (raw_state: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]) => raw_state.map(rawResource =>
  new Resource(rawResource).state
);
