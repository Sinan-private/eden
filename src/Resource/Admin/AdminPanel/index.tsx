import {useGame} from "../../../context/game.context.ts";
import {AdminPanel} from "./AdminPanel.tsx";

export default function Admin() {
  const {isFetching, showAdminPanel} = useGame();
  if (!showAdminPanel) {
    return null;
  }

  return isFetching
    ? <div>Loading</div>
    : <AdminPanel/>
}
