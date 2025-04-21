import {GameState} from "@/Game/Classes/Game/GameState.ts";
import {ResourceStoreClass} from "@/GameController/Resource";

export type GameBaseProps = {
  _resourceStore: ResourceStoreClass;
  _gameState: GameState;
}
