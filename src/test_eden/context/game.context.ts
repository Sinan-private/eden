import {createContainer} from "unstated-next";
import {useTurnSubscription} from "@/Resource";
import {useTick} from "@/Resource/context/tick.context.ts";
import {game} from "@/test_eden/Classes/Game/createSingletonGame.ts";

// Todo -> This now only works as a singleton to handle the turnSubscription and can be removed?

const useGameBase = () => {
  // const tick = useTick();
  const _game = game();
  const {
    slaves,
    behemoth, upstream,
    faction_arwa,
    faction_marid,
  } = _game

  // useTurnSubscription(slaves.turnUpdate);
  // useTurnSubscription(upstream.turnUpdate);
  // useTurnSubscription(() => behemoth.turnUpdate(_game));
  // useTurnSubscription(() => faction_marid.turnUpdate(_game));
  // useTurnSubscription(() => faction_arwa.turnUpdate(_game));

  return {
    // ...tick,
    ..._game,
  }
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
