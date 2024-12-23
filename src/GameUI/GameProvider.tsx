import {observer} from "mobx-react";
import {Game} from "./Game.tsx";
import {useGame} from "../context/game.context.ts";

export const GameProvider = observer(() => {
  const {isFetching} = useGame();
  return !isFetching
    ?(<Game />)
    : null
})