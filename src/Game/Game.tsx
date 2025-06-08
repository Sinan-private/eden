import {game, GameClass} from "@/Game";
import {Gaja} from "@/Game/Views/Gaja/Gaja.tsx";
import {Background} from "./Views/Background.tsx";
import {Interface} from "./Interface/Interface.tsx";
import {Upstream} from "@/Game/Views/Upstream.tsx";
import {EventHandler} from "@/Game/EventHandler.tsx";

declare global {
  interface Window {
    game: GameClass;
  }
}

export const Game = () => {
  window.game = game();
  console.log(game())
  return (
    <Screen id="Game">
      <Background/>
      <Gaja/>
      <Upstream/>
      <Interface/>
      <EventHandler />
    </Screen>
  )
}

const Screen = ({children, id}: {children: React.ReactNode; id: string}) => (
  <div id={id} className="fixed top-0 left-0 w-screen h-screen overflow-hidden font-geist-sans text-sm antialiased z-0">
    {children}
  </div>
)

