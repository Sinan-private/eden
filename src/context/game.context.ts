import {useEffect} from "react";
import {createContainer} from "unstated-next";
import {initialState} from "../gameRules/gameInit.ts";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {useResource} from "../Resource/useResource.ts";
import {nextTurn} from "../Resource/helpers/nextTurn.ts";
import {getTurnUpdate} from "../gameRules/getTurnUpdate.ts";

const useGameBase = () => {
  // The resource offers all info and update methods. The setState is only needed here to handle turn updates directly.
  const {setState, ...resource} = useResource(initialState);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);

  // With every tick a new turn is triggered with all included production
  useEffect(() => {
    const {isActive, current} = tick;
    const isNextTurn = isActive && prevTick !== current;
    if (isNextTurn) {
      setState(nextTurn(resource.state, getTurnUpdate))
    }
  }, [tick, prevTick, resource.state, setState]);

  return {
    resource,
    tick,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
