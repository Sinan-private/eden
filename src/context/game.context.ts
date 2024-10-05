import {useCallback, useEffect, useState} from "react";
import {createContainer} from "unstated-next";
import {initialState} from "../gameRules/gameInit.ts";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {Trade} from "../Resource/Trade.ts";
import {mergeChangeToState, nextTurn} from "./helper/stateUpdates.ts";
import {get as _get} from "./helper/getResource.ts";
import {TradeUpdate, Update} from "./types.ts";
import {ResourceKeys} from "../gameRules/types.ts";
import {ResourceConversion} from "../gameRules/ResourceConversion.ts";


const useGameBase = () => {
  const {current, isTicking, startGlobalTick, pauseGlobalTick} = useTick();
  const [state, setState] = useState(initialState);
  const prevTick = usePrevious(current);
  const convertResources = new ResourceConversion(state);

  const get = useCallback(
    (key: ResourceKeys, _state = state) => _get(key, _state),
    [state]);

  const onUpdate = (update: Update) => {
    const newState = get(update.key).updateValueBy(update.value || 0)
    setState(mergeChangeToState([newState], state))
  }

  const trade = useCallback((
      {
        give,
        gain,
        multiplier = 1
      }: TradeUpdate) =>
      new Trade(give, gain, state, multiplier),
    [state]);

  const onTrade = (update: TradeUpdate) => {
    if (trade(update).isPartlyPossible) {
      setState(trade(update).newState)
    }
  };

  const getExternal = (key: ResourceKeys) => get(key).state;

  useEffect(() => {
    const isNextTurn = isTicking && prevTick !== current;
    if (isNextTurn) {
      setState(nextTurn(state))
    }
  }, [isTicking, current, prevTick, get, state]);

  return {
    state,
    get: getExternal,
    // resources,
    trade,
    onUpdate,
    onTrade,
    convertResources,
    // onBakeBread,
    // onBuildField,
    // onBuildWindmill,
    // onBuildBakery,
    currentTick: current,
    startGlobalTick,
    pauseGlobalTick,
    isTicking
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
