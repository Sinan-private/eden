import {observer} from "mobx-react";
import {Box, Button} from "@/components/ui";
import {HealthBar} from "@/components/ui/HealthBar.tsx";
import {useGame} from "@/test_eden/context/game.context.ts";
import {SegmentedBar} from "@/components/ui/SegmentedBar.tsx";

export const EarthContent = observer(() => {
  const {resources, slaves, gameState} = useGame();
  const {getByKey} = resources;
  const influence = getByKey('human_influence');
  const pollution = getByKey('earth_pollution');
  const virtue = getByKey('human_virtue');
  const slaveCurrent = slaves.slaves_enslaved.value
  const slaveMax = slaveCurrent + slaves.slaves_roaming.value
  const influence_points = gameState.influence.can_spend
  const onRaisePollution = () => {
    const pollution = resources.getByKey('earth_pollution')
    const onSuccess = () => pollution.updateValueBy(30)
    gameState.influence.spendPoints(1, onSuccess)
  }
  const onRaiseVirtue = () => {
    const virtue = resources.getByKey('human_virtue')
    const onSuccess = () => virtue.updateValueBy(30)
    gameState.influence.spendPoints(2, onSuccess)
  }
  console.log(influence_points)
  return (
    <div className="flex justify-end pr-4">
      <Box className="min-w-[240px] flex flex-col gap-4" variant="default">
        <div className="w-full">
          <p className="mb-1 text-sm">Slaves ({slaveCurrent})</p>
          <HealthBar value={{value: slaveCurrent, max: slaveMax}} className="h-1"/>
        </div>
        <div className="w-full">
          <p className="mb-1 text-sm">Influence</p>
          <SegmentedBar value={influence.state} thresholds={[33, 66]}/>
        </div>
        <div className="w-full">
          <p className="mb-1 text-sm">Pollution</p>
          <div className="flex items-center gap-2">
            <HealthBar value={pollution.state}/>
            <Button size="sm" variant="ghost" onClick={onRaisePollution} disabled={influence_points < 1}>+</Button>
          </div>
        </div>
        <div className="w-full">
          <p className="mb-1 text-sm">Virtue</p>
          <div className="flex items-center gap-2">
            <HealthBar
              value={virtue.state}
              color={["red", "yellow", "green", "blue"]}
              thresholds={[20, 50, 80]}
            />
            <Button size="sm" variant="ghost" onClick={onRaiseVirtue} disabled={influence_points < 2}>+</Button>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 mr-10">
            <p>good</p>
            <p>neutral</p>
            <p>evil</p>
          </div>
        </div>
      </Box>
    </div>
  )
})