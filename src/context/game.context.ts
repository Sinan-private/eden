import {useCallback, useEffect} from "react";
import {createContainer} from "unstated-next";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {ResourceBase, ResourceUpdateProps, useResource} from "../Resource";
import {getResourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";
import {useApi} from "./useApi.ts";
// import {EditResource} from "../gameRules/EditResource.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {useComponentMount} from "../hooks/useComponentMount.ts";

const useGameBase = () => {
  const {fetchResources, updateResources} = useApi();
  // The resource offers all info and update methods. The nextTurn is only needed here to handle turn updates only in here.
  const {nextTurn, setState, ...resources} = useResource<ResourceKeys, ResourceTypes>([]);
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
  }, [tick, prevTick, resources.state, nextTurn]);

  const turnUpdate = useCallback(() => {
    const updates = getResourceTurnUpdate(resources.check, resources.state);
    return updates
  }, [resources])

  const writeInitialResources = (newState = resources.state) => {
    console.log(newState)
    updateResources(newState)
    setState(newState)
  }

  return {
    resources,
    tick,
    getResourceTurnUpdate: turnUpdate,
    writeInitialResources
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;

const getInitialState = (raw_state: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]) => raw_state.map(rawResource =>
  new ResourceBase(rawResource).state
);
