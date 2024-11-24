import {useEffect, useState} from "react";
import {createContainer} from "unstated-next";
import {useTick} from "./tick.ts";
import {usePrevious} from "../Resource/hooks/usePrevious.ts";
import {useResource} from "../Resource";
import {getResourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";
import {useApi} from "./useApi.ts";
import {useComponentMount} from "../Resource/hooks/useComponentMount.ts";

import {ResourceKeys, ResourceTypes} from "../Resource/specificTypes.ts";

const useGameBase = () => {
  const {fetchResources} = useApi();
  const [isFetching, setIsFetching] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // The resource offers all info and update methods. The nextTurn is only needed here to handle turn updates only in here.
  const {nextTurn, setState, ...resources} = useResource<ResourceKeys, ResourceTypes>([]);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);
  useComponentMount(async () => {
    const rawState = await fetchResources();
    setState(rawState);
    setIsFetching(false);
  })

  const onOpenAdminPanel = () => setShowAdminPanel(true);
  const onCloseAdminPanel = () => setShowAdminPanel(false);
  const onToggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);

  // With every tick a new turn is triggered with all included production
  useEffect(() => {
    const {isActive, current} = tick;
    const isNextTurn = isActive && prevTick !== current;
    if (isNextTurn) {
      nextTurn(getResourceTurnUpdate)
    }
  }, [tick, prevTick, nextTurn]);

  return {
    resources,
    isFetching,
    tick,
    showAdminPanel,
    onOpenAdminPanel,
    onCloseAdminPanel,
    onToggleAdminPanel,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
