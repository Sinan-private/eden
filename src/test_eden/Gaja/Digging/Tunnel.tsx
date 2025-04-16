import {useGame} from "@/test_eden/context/game.context.ts";
import {Acid} from "@/test_eden/Gaja/Digging/Acid.tsx";
import {observer} from "mobx-react";

export const Tunnel = observer(({$digging_depth}: { $digging_depth: number }) => {
  const {behemoth} = useGame()
  const {pastHarvests} = behemoth
  const images = pastHarvests.flatMap(({mana_images}) => mana_images)

  return (
    <div id="Tunnel" className="relative h-12 bg-zinc-950 transition overflow-hidden"
         style={{width: $digging_depth + '%'}}>
      <Acid/>
      {images.map(image => (
        <img
          key={image.id}
          src={image.image}
          className="absolute h-5 bottom-0 transform -translate-x-1/2" style={{left: image.position + '%'}}
        />
      ))}
    </div>
  )
})