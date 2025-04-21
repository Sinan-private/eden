import {observer} from "mobx-react";
import {Button} from "@/GameController/components/ui/button.tsx";
import {LevelGain, LevelProgress} from "./LevelProgress.tsx";
import {BEHEMOTH_STAMINA_PER_SLAVE, BEHEMOTH_STAMINA_PER_WASTED_SLAVE} from "../constants/constants.ts";
import {Box} from "@/GameController/components/ui";
import {game} from "@/test_eden/Classes/Game";

export const BehemothManager = observer(() => {
  const {behemoth, slaves, resources} = game();
  const {
    level_requirements,
    levelUp,
    meets_level_requirements
  } = behemoth.level;
  const staminaIcon = resources.getByKey('behemoth_stamina').icon;
  return (
    <div className="p-2">
      <Box>
        <div className="flex">
          <div style={{flex: "0 1 200px"}}>
            <div id="Behemoth level up costs">
              <p>Costs</p>
              {level_requirements.give?.map(cost => (
                <LevelProgress key={cost.key} level={cost}/>
              ))}
            </div>
            {level_requirements.need &&
              <div id="Behemoth level up needs">
                <p>Needs</p>
                {level_requirements.need?.map(need => (
                  <LevelProgress key={need.key} level={need}/>
                ))}
              </div>
            }
          </div>
          <div id="level up gains" className="px-2">
            Gains
            {level_requirements.gain?.map(gain => (
              <LevelGain key={gain.key} gain={gain}/>
            ))}
          </div>
          <Button disabled={!meets_level_requirements} onClick={levelUp}>
            Level up
          </Button>
        </div>
        <div className="gap-1">
        <button onClick={behemoth.consumeWastedSlave}>
          ({slaves.slaves_wasted.beautify.value}) Consume wasted slave
          <img src={staminaIcon} alt="Stamina" />
          {BEHEMOTH_STAMINA_PER_WASTED_SLAVE}
        </button>
        <button onClick={behemoth.consumeSlave}>
          ({slaves.unassigned_slaves.toFixed()}) Consume slave
          <img src={staminaIcon} alt="Stamina" />
          {BEHEMOTH_STAMINA_PER_SLAVE}
        </button>
        </div>
      </Box>
    </div>
  )
})


