import {useState} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTickSubscription} from "../../Resource";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";

const useGameBase = () => {
  const resources = useResource();
  const behemoth = new BehemothClass(resources);
  const [isBehemothClimbing, setIsBehemothClimbing] = useState(false);
  const startClimbing = () => setIsBehemothClimbing(true);
  const stopClimbing = () => setIsBehemothClimbing(false);
  const turnUpdate = () => {
    console.log('isBehemothClimbing', isBehemothClimbing)
    if (isBehemothClimbing) {
      const speed = resources.get('behemoth_climb_speed')
    console.log('speed', speed)
      speed.updateValueBy(0.2)
      resources.get('behemoth_climb_height').updateValueBy(speed.value)
    }
  }
  useTickSubscription(turnUpdate);

  return {
    resources,
    // I need to consider that the Behemoth can be in between states. Player chose to stop, but it takes some time for the Behemoth to come to a stop
    startClimbing,
    stopClimbing,
  };
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;

type BehemothStates = {
  movementRequested: boolean;
  readyToMove: boolean; // calculated
  inMotion: boolean; // calculated
}

const behemothDefaultStates = {
  movementRequested: false,
}