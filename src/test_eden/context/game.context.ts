import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTickSubscription} from "../../Resource";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";

const useGameBase = () => {
  const {resources} = useResource();
  const behemoth = useMemo(() => new BehemothClass(resources.getByType("behemoth")), [resources]);
  const turnUpdate = () => {
    if (behemoth.movementRequested) {
      const speed = resources.get('behemoth_climb_speed')
      speed.updateValueBy(0.2)
      resources.get('behemoth_climb_height').updateValueBy(speed.value)
    } else {
      const speed = resources.get('behemoth_climb_speed')
      speed.updateValueBy(-1)
      resources.get('behemoth_climb_height').updateValueBy(speed.value)
    }
  }
  useTickSubscription(turnUpdate);

  return {
    resources,
    behemoth,
  };
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
