import {observer} from "mobx-react";
import {Box, Button, Stack, Typography} from "@mui/material";
import {Card} from "./Card.ts";
import {useGame} from "../context/game.context.ts";
import {LevelGain, LevelProgress} from "./LevelProgress.tsx";

export const PlayerManager = observer(() => {
  const {level} = useGame().player;
  const {
    level_requirements,
    levelUp,
    meets_level_requirements
  } = level;
  return (
    <Box p={2}>
      <Card>
        <Stack direction="row">
          <Box flex="0 1 200px">
            <Box id="Behemoth level up costs">
              <Typography>Costs</Typography>
              {level_requirements.give?.map(cost => (
                <LevelProgress key={cost.key} level={cost}/>
              ))}
            </Box>
            {level_requirements.need &&
              <Box id="Behemoth level up needs">
                <Typography>Needs</Typography>
                {level_requirements.need?.map(need => (
                  <LevelProgress key={need.key} level={need}/>
                ))}
              </Box>
            }
          </Box>
          <Box id="level up gains" px={2}>
            Gains
            <Typography>
              Mana level {level.level + 1}
            </Typography>
            {level_requirements.gain?.filter(({key}) => !key.startsWith('liquid_mana'))
              .map(gain => (
                <LevelGain key={gain.key} gain={gain}/>
              ))}
          </Box>
          <Button disabled={!meets_level_requirements} onClick={levelUp}>
            Level up
          </Button>
        </Stack>

      </Card>
    </Box>
  )
})