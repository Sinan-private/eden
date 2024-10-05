import {useCallback, useEffect, useState} from "react";
import {createContainer} from "unstated-next";
import {initialState} from "../gameRules/gameInit.ts";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {Trade} from "../Resource/Trade.ts";
import {Update} from "./types.ts";
import {mergeChangeToState, turnUpdate} from "./helper/stateUpdates.ts";
import {get as _get} from "./helper/getResource.ts";
import {ResourceKeys} from "../gameRules/types.ts";


const useGameBase = () => {
  const {current, isTicking, startGlobalTick, pauseGlobalTick} = useTick();
  const [state, setState] = useState(initialState);
  const prevTick = usePrevious(current);

  const get = useCallback(
    (key: ResourceKeys, _state = state) => _get(key, _state),
    [state]);

  const onUpdate = (update: Update) => {
    const newState = get(update.key).updateValueBy(update.value || 0)
    setState(mergeChangeToState([newState], state))
  }

  const trade = useCallback((
      give: Update[],
      gain: Update[],
      multiplier = 1
    ) => new Trade(give, gain, state, multiplier),
    [state]);

  const onTrade = (
    give: Update[],
    gain: Update[],
    multiplier = 1
  ) => setState(trade(give, gain, multiplier).newState);

  const getExternal = (key: ResourceKeys) => get(key).state;

  // const newState = useTurn(current, isTicking, state, get)

  // useEffect(() => {
  //   if (current !== prevTick) {
  //     // console.log(newState, state)
  //     setState(newState)
  //   }
  // }, [current, newState, prevTick]);


  useEffect(() => {
    // Update each turn
    const isNextTurn = isTicking && prevTick !== current;
    if (isNextTurn) {
      // const changes = getTurnUpdate(state);

      // const newState = changes.reduce((newState, change) => {
      //   newState = mergeChangeToState(singleChange(change, newState), newState);
      //   return newState
      // }, [...state]);
      setState(turnUpdate(state))
    }
  }, [isTicking, current, prevTick, get, state]);

  return {
    state,
    get: getExternal,
    // resources,
    trade,
    onUpdate,
    onTrade,
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
