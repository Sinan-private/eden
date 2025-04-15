import {useGame} from "@/test_eden/context/game.context.ts";
import mana_sparkle from "@/assets/animation/mana-sparkle.gif";

export const Acid = () => {
  const {behemoth, mana} = useGame()
  const flushed_sum = mana.flushed_mana_sum <= 450 ? mana.flushed_mana_sum : 450;
  const {flushing_depth} = behemoth
  return (
    <div
      id="Acid"
      className="absolute left-0 bottom-0 bg-teal-600/80 w-full overflow-hidden"
      style={{
        height: flushing_depth.state.value + '%',
        // background: 'linear-gradient(0deg,rgba(13, 148, 136, 1) 0%, rgba(125, 211, 252, 1) 50%, rgba(240, 249, 255, 1) 100%)'
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
}