import {observer} from "mobx-react";
import {LevelGain, LevelProgress} from "./LevelProgress.tsx";
import {Button} from "@/GameController/components/ui/button.tsx";
import {Box} from "@/GameController/components/ui";
import {game} from "@/Game/Classes/Game";

export const PlayerManager = observer(() => {
  const {level} = game().player;
  const {
    level_requirements,
    levelUp,
    meets_level_requirements
  } = level;
  return (
    <div className="p-2">
      <Box>
        <div className="flex">
          <div style={{flex: '0 1 200px'}}>
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
            <p>
              Mana level {level.level + 1}
            </p>
            {level_requirements.gain?.filter(({key}) => !key.startsWith('liquid_mana'))
              .map(gain => (
                <LevelGain key={gain.key} gain={gain}/>
              ))}
          </div>
          <Button disabled={!meets_level_requirements} onClick={levelUp}>
            Level up
          </Button>
        </div>

      </Box>
    </div>
  )
})