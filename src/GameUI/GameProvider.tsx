import {Game} from "./Game.tsx";
import {useGame} from "../context/game.context.ts";
import {observer} from "mobx-react";

export const GameProvider = observer(() => {
  const {isFetching} = useGame();
  return !isFetching
    ?(<Game />)
    : null
})