import {observer} from "mobx-react";
import {Box} from "@/components/ui";
import {HealthBar} from "@/components/ui/HealthBar.tsx";
import {useGame} from "@/test_eden/context/game.context.ts";

export const EarthContent = observer(() => {
  const {resources, slaves} = useGame();
  const {getByKey} = resources;
  const influence = getByKey('human_influence');
  const pollution = getByKey('earth_pollution');
  const virtue = getByKey('human_virtue');
  const slaveCurrent = slaves.slaves_enslaved.value
  const slaveMax =slaveCurrent + slaves.slaves_roaming.value
  return (
    <div className="flex justify-end pr-4">
      <Box className="min-w-[240px] flex flex-col gap-4" variant="default">
        <div className="w-full">
          <p className="mb-1 text-sm">Slaves ({slaveCurrent})</p>
          <HealthBar value={{value: slaveCurrent, max: slaveMax}}/>
        </div>
        <div className="w-full">
          <p className="mb-1 text-sm">Influence</p>
          <HealthBar value={influence}/>
        </div>
        <div className="w-full">
          <p className="mb-1 text-sm">Pollution</p>
          <HealthBar value={pollution}/>
        </div>
        <div className="w-full">
          <p className="mb-1 text-sm">Virtue</p>
          <HealthBar
            value={virtue}
            color={["red", "yellow", "green", "blue"]}
            thresholds={[20, 50, 80]}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <p>good</p>
            <p>neutral</p>
            <p>evil</p>
          </div>
        </div>
      </Box>
    </div>
  )
})