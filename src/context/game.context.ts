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

const useGameBase = () => {
  const tick = useTick();
  const [state, setState] = useState(initialState);
  const prevTick = usePrevious(tick.current);

  // Get the full Resource class
  const get = useCallback(
    (key: ResourceKeys, _state = state) => _get(key, _state),
    [state]);

  // Update a single Resource
  const onUpdate = (update: Update) => {
    const newState = get(update.key).updateBy(update)
    setState(mergeChangeToState([newState], state))
  }

  // Only a simplification to pass the state in once
  const trade = useCallback((
      {
        give,
        gain,
        multiplier = 1
      }: TradeUpdate) =>
      new Trade(give, gain, state, multiplier),
    [state]);

  // Expects the TradeUpdate object to handle a trade if at least a part of it can be executed
  const onTrade = (update: TradeUpdate) => {
    if (trade(update).isPartlyPossible) {
      setState(trade(update).newState)
    }
  };

  // The exposed get method only returns the state of the resource
  const getExternal = (key: ResourceKeys) => get(key).state;

  // With every tick a new turn is triggered with all included production
  useEffect(() => {
    const {isActive, current} = tick;
    const isNextTurn = isActive && prevTick !== current;
    if (isNextTurn) {
      setState(nextTurn(state))
    }
  }, [tick, prevTick, get, state]);

  return {
    state,
    get: getExternal,
    // This returns the full Resource for deeper evaluations
    check: get,
    onUpdate,
    onTrade,
    tick,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
