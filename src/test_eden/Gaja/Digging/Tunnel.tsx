import {useGame} from "@/test_eden/context/game.context.ts";
import {GameClass} from "@/test_eden/Classes/GameClass.ts";
import {Acid} from "@/test_eden/Gaja/Digging/Acid.tsx";
import mana_for_harvest_5 from "@/assets/images/Mana-for-harvest5.png";
import mana_for_harvest_1 from "@/assets/images/Mana-for-harvest1.png";
import {useTurnSubscription} from "@/Resource";
import {observer} from "mobx-react";

export const Tunnel = observer(({$digging_depth}: { $digging_depth: number }) => {
  const {behemoth, mana, resources} = useGame()
  const {digging_depth, pastHarvests, currentHarvest} = behemoth
  // const {harvestRender} = GameClass.getInstance()
  // const mana_to_harvest = mana.getManaCount('dirty_mana');
  // Todo each time I am flushing an instance of the harvest is created and "closed" the moment the flushing stops.
  // console.log(currentHarvest?.id, pastHarvests)

  // const imageList = useMemo(() => {
  //   return getManaImageValues(mana_to_harvest)
  // }, [mana_to_harvest]);
  // console.log(imageList)
  // const x = useRef(new HarvestRenderClass(resources, behemoth)).current

  // useTurnSubscription(harvestRender.turnUpdate)
  return (
    <div id="Tunnel" className="relative h-12 bg-zinc-950 transition overflow-hidden"
         style={{width: $digging_depth + '%'}}>
      <Acid/>
      <img className="absolute h-10 bottom-0" src={mana_for_harvest_5}/>
      <img className="absolute h-5 bottom-0 transform -translate-x-1/2" style={{left: digging_depth.value + '%'}}
           src={mana_for_harvest_1}/>
    </div>
  )
})