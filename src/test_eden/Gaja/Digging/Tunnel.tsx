import {observer} from "mobx-react";
import {cn} from "@/lib/utils.ts";
import {Acid} from "@/test_eden/Gaja/Digging/Acid.tsx";
import tunnelEdges from "../../../assets/images/Tunnel.png"
import {game} from "@/test_eden/Classes/Game";

export const Tunnel = observer(({$digging_depth}: { $digging_depth: number }) => {
  const {gameState} = game()
  const {renderHarvest} = gameState
  const renderImages = renderHarvest();
  // I want to blend in the mana

  return (
    <div
      id="Tunnel"
      className="relative h-12 bg-zinc-950 overflow-hidden"
      style={{width: $digging_depth + '%', transition: 'width 0.5s ease'}}
    >
      {renderImages.map(({image, id, xPosition, yPosition}) => (
        <img
          key={id}
          src={image}
          className={cn(
            "absolute h-7 transform -translate-x-1/2",
            yPosition === 'top' ? 'top-0 bottom-auto rotate-180' : 'bottom-0 top-auto'
          )} style={{left: xPosition + '%'}}
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