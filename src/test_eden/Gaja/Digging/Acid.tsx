import mana_sparkle from "@/assets/animation/mana-sparkle.gif";
import {game} from "@/test_eden/Classes/Game/createSingletonGame.ts";
import {observer} from "mobx-react";

const MAX_HEIGHT = 450

export const Acid = observer(() => {
  const {behemoth, mana} = game()
  const flushed_sum = mana.flushed_mana_sum <= MAX_HEIGHT ? mana.flushed_mana_sum : MAX_HEIGHT;
  const {flushing_depth} = behemoth
  return (
    <div
      id="Acid"
      className="absolute left-0 bottom-0 bg-teal-600 w-full overflow-hidden"
      style={{
        height: flushing_depth.state.value + '%',
        opacity: flushing_depth.state.value / 100,
      }}
    >
      <div
        className="absolute bottom-0 left-0 w-full h-[500px]"
        style={{
          bottom: -flushed_sum,
          background: 'linear-gradient(0deg,rgba(13, 148, 136, 1) 0%, rgba(125, 211, 252, 1) 50%, rgba(184, 230, 254, 1) 100%)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-full"
        style={{background: `url(${mana_sparkle})`, opacity: flushed_sum / 100}}
      />
    </div>
  )
})
