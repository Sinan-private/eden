import {observer} from "mobx-react";
import {cn} from "@/lib/utils.ts";
import {Acid} from "@/Game/Views/Gaja/Digging/Acid.tsx";
import tunnelEdges from "../../../../assets/images/Tunnel.png"
import {game} from "@/Game";

export const Tunnel = observer(() => {
  const {behemoth} = game()
  const {digging_depth} = behemoth
  const {gameState} = game()
  const {renderHarvest} = gameState
  const renderImages = renderHarvest();

  return (
    <div
      id="Tunnel"
      className="relative h-12 bg-zinc-950 overflow-hidden"
      style={{width: digging_depth.value + '%', transition: 'width 0.5s ease'}}
    >
      {renderImages.map(({image, id, xPosition, yPosition}) => (
        <img
          key={id}
          src={image}
          className={cn(
            "absolute h-7 transform -translate-x-1/2",
            yPosition === 'top' ? 'top-0 bottom-auto rotate-180' : 'bottom-0 top-auto'
          )}
          style={{left: xPosition + '%'}}
          alt="mana image"
        />
      ))}
      <Acid />
      <Edges />
    </div>
  )
})

const Edges = () => (
  <div className="relative min-w-24 h-full w-full bg-contain bg-repeat" style={{backgroundImage: `url(${tunnelEdges})`}}>
  </div>
)
