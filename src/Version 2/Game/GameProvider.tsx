import {Game} from "./Game.tsx";
import {useGame} from "../../context/game.context.ts";
import {observer} from "mobx-react";

export const GameProvider = observer(() => {
  const {isFetching, resources} = useGame();
  // console.log(isFetching, resources.allResources)
  return !isFetching
    ?(<Game />)
    : null
})