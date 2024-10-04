import {createContainer} from "unstated-next";
import {useCallback, useEffect, useMemo, useState} from "react";
import {gameInit, ResourceKeys} from "./gameInit.ts";
import {Resources} from "../Resource/Resources.ts";
import {ResourceUpdateProps} from "../Resource/types.ts";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {ResourceUpdateList} from "../Resource/updateFormat.ts";

const useGameBase = () => {
  const {current, isTicking, startGlobalTick, pauseGlobalTick} = useTick();
  // This should be usable for changes that are supposed to happen with the next tick rather than instantly.
  // const [stackedChanges, setStackedChanges] = useState([]);
  const [state, setState] = useState(gameInit);
  const resources = useMemo(() => new Resources(state), [state]);
  const prevTick = usePrevious(current);

  const onUpdate = (update: ResourceUpdateProps<ResourceKeys>) => {
    setState(state => new Resources(state).update(update))
  }

  const onStackChange = () => {

  }

  const tradeIfPossible = useCallback((
    give: ResourceUpdateProps<ResourceKeys>[],
    gain: ResourceUpdateProps<ResourceKeys>[],
    amount = 1
  ) => {
    const trade = resources.trade(give, gain, amount)
    console.log(trade)
    if (trade.isPartlyPossible) {
      setState(trade.newState)
    }
  }, [resources])

  const onBakeBread = useCallback(() => {
    tradeIfPossible(
      [{key: 'corn', value: 1}, {key: 'water', value: 2}, {key: 'gold', value: 1}],
      [{key: 'bread', value: 1}],
      resources.get('bakery').value
    )}, [resources, tradeIfPossible]
  )

  const onBuildField = () =>
    tradeIfPossible(
      [{key: 'land', value: 1}, {key: 'gold', value: 10}],
      [{key: 'field', value: 1}]
    )

  const onBuildWindmill = () =>
    tradeIfPossible(
      [{key: 'land', value: 1}, {key: 'gold', value: 50}],
      [{key: 'windmill', value: 1}]
    )

  const onBuildBakery = () =>
    tradeIfPossible(
      [{key: 'land', value: 1}, {key: 'gold', value: 100}],
      [{key: 'bakery', value: 1}]
    )


  useEffect(() => {
    // Here the problem is again that one change is overwriting the other
    if (isTicking && prevTick !== current) {

    const corn = resources.get('corn').updateValueBy(resources.get('field').value);

    const changes: ResourceUpdateList<ResourceKeys> = [
      {
        type: "increment",
        update: {
          key: 'corn',
          value: resources.get('field').value
        }
      },
      {
        type: "trade",
        update: {
          give: [{key: 'corn', value: 1}, {key: 'water', value: 2}, {key: 'gold', value: 1}],
          gain: [{key: 'bread', value: 1}],
          multiplier: resources.get('bakery').value
        }
      },
      {
        type: "trade",
        update: {
          give: [{key: 'land', value: 1}, {key: 'gold', value: 10}],
          gain: [{key: 'field', value: 1}],
        }
      },
      {
        type: "decrement",
        update: {
          key: 'corn',
          value: 2
        }
      },
    ];

    const newState = resources.__stackedUpdates(changes);
    console.log(state, newState)

    const bread = resources.trade(
        [{key: 'corn', value: 1}, {key: 'water', value: 2}, {key: 'gold', value: 1}],
        [{key: 'bread', value: 1}],
        resources.get('bakery').value
      );
    const field = resources.trade(
      [{key: 'land', value: 1}, {key: 'gold', value: 10}],
      [{key: 'field', value: 1}]
    )
      console.log([...bread.stateUpdates, ...field.stateUpdates])
    setState(resources.update([...bread.stateUpdates, ...field.stateUpdates]))
    }

  }, [isTicking, current, resources, onBakeBread, prevTick]);

  return {
    state,
    resources,
    onUpdate,
    onBakeBread,
    onBuildField,
    onBuildWindmill,
    onBuildBakery,
    currentTick: current,
    startGlobalTick,
    pauseGlobalTick,
    isTicking
  };
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
