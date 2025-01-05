import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTurnSubscription} from "../../Resource";
import {BehemothClass} from "../Classes/Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Classes/Slaves/SlaveClass.ts";
import {IfritClass, GhoulClass, ArwaClass, MaridClass} from "../Classes/Factions";
import {Mana} from "../Classes/Mana/Mana.ts";
import {Upstream} from "../Classes/Upstream.ts";
import {Turn} from "../Classes/Turn.ts";

const useGameBase = () => {
  const {resources} = useResource();
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  const mana = useMemo(() => new Mana(resources), [resources])
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const upstream = useMemo(() => new Upstream(resources), [resources])
  const factionIfrit = useMemo(() => new IfritClass(resources, slaves), [resources, slaves])
  const factionArwa = useMemo(() => new ArwaClass(resources, slaves), [resources, slaves])
  const factionGhoul = useMemo(() => new GhoulClass(resources, slaves), [resources, slaves])
  const factionMarid = useMemo(() => new MaridClass(resources, slaves), [resources, slaves])
  const tick = useTurnSubscription();
  // useTurnSubscription(behemoth.turnUpdate);
  useTurnSubscription(slaves.turnUpdate);
  useTurnSubscription(upstream.turnUpdate);

  const game = {
    ...tick,
    resources,
    behemoth,
    slaves,
    mana,
    upstream,
    factions: {
      factionMarid,
      factionIfrit,
      factionGhoul,
      factionArwa,
      all: [factionIfrit, factionMarid, factionGhoul, factionArwa]
    }
  };
  const turn = useMemo(() => new Turn(game), [game]);
  useTurnSubscription(turn.behemothTurnUpdate);
  useTurnSubscription(turn.maridTurnUpdate);
  useTurnSubscription(turn.arwaTurnUpdate);


  return game
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
