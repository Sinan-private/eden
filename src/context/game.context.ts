import {useCallback, useEffect} from "react";
import {createContainer} from "unstated-next";
import {initialState} from "../gameRules/gameInit.ts";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {useResource} from "../Resource";
import {getResourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";

const useGameBase = () => {
  // The resource offers all info and update methods. The nextTurn is only needed here to handle turn updates only in here.
  const {nextTurn, ...resources} = useResource(initialState);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);

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

  return {
    resources,
    tick,
    getResourceTurnUpdate: turnUpdate,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
