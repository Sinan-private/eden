import {useGame} from "@/test_eden/context/game.context.ts";
import {Acid} from "@/test_eden/Gaja/Digging/Acid.tsx";
import {observer} from "mobx-react";

export const Tunnel = observer(({$digging_depth}: { $digging_depth: number }) => {
  const {behemoth, resources} = useGame()
  const {pastHarvests} = behemoth
  const images = pastHarvests.flatMap(({getManaImages}) => getManaImages())
  const x = images.map(a => a.value)
  // console.log(x)
  // console.log(resources.getByKey('dirty_mana_level_1').sessionSpent)
  return (
    <div
      id="Tunnel"
      className="relative h-12 bg-zinc-950 overflow-hidden"
      style={{width: $digging_depth + '%', transition: 'width 0.5s ease'}}
    >
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