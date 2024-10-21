import {useGame} from "../context/game.context.ts";
import {AdminPanel} from "./AdminPanel.tsx";

export default function Admin() {
  const {isFetching} = useGame();

  return isFetching
    ? <div>Loading</div>
    : <AdminPanel/>
}
