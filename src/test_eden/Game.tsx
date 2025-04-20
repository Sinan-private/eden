import {observer} from "mobx-react";
import {Gaja} from "./Gaja/Gaja.tsx";
import upstream_image from '../assets/images/upstream.gif';
import {Background} from "./Background.tsx";
import {Interface} from "./Interface/Interface.tsx";
import {game} from "@/test_eden/Classes/Game/createSingletonGame.ts";
import {GameClass} from "@/test_eden/Classes/Game/GameClass.ts";

const IMAGE_HEIGHT = 400

declare global {
  interface Window {
    game: GameClass;
  }
}

export const Game = () => {
  window.game = game();
  return (
    <Screen id="Game">
      <Background/>
      <Gaja/>
      <Upstream/>
      <Interface/>
    </Screen>
  )
}

const Screen = ({children, id}: {children: React.ReactNode; id: string}) => (
  <div id={id} className="fixed top-0 left-0 w-screen h-screen overflow-hidden font-geist-sans text-sm antialiased">
    {children}
  </div>
)

const Upstream = observer(() => {
  const {upstream, behemoth} = game();
  const position = IMAGE_HEIGHT - (behemoth.climb_height.value - upstream.height.value);
  return position < -300
    ? null
    : (
      <div id="Upstream" className="fixed pointer-events-none w-full h-[600px] left-0 z-[100]" style={{bottom: -400 + position}}>
        <div className="relative w-full h-[200px] left-0 z-1" style={{backgroundImage: `url(${upstream_image})`, backgroundPosition: '0 280px'}} />
        <div className="w-full h-[400px] bg-black" />
      </div>
    )
})
