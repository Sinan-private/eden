import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {Box, Button, Chip, LinearProgress, Stack, Typography} from "@mui/material";
import {TradeChange} from "../../Resource";
import {Card} from "./Card.ts";

export const BehemothManager = observer(() => {
  const {behemoth} = useGame();
  const {
    level_requirements,
    levelUp,
    meets_level_requirements
  } = behemoth.level;
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
          <Box id="level up gains" px={2} >
            Gains
            {level_requirements.gain?.map(gain => (
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

type LevelGainProps = {
  gain: TradeChange
}

const LevelGain = ({gain}: LevelGainProps) => {
  const {get} = useGame().resources;
  const {label, icon} = get(gain.key)

  return (
    <Stack direction="row">

      <Box p={1} mx={1}  position="relative">
        <img src={icon} alt={label}/>
        <Typography
          variant="caption"
          textAlign="center"
          sx={{position: 'absolute', bottom: 8, left: 0, width: '100%'}}
        >{label}</Typography>
      </Box>
      {gain.min &&
        <LevelGainDetail label="Value" value={gain.min} />
      }
      {gain.max &&
        <LevelGainDetail label="Max" value={gain.max} />
      }
      {gain.value &&
        <LevelGainDetail label="Value" value={gain.value} />
      }
    </Stack>
  )
}

const LevelGainDetail = ({label, value}: {label: string; value: number}) => (
  <Stack justifyContent="center" mr={1} mt={-1}>
    <Typography
      variant="caption"
      textAlign="center"
      position="relative"
      top={8}
    >
      {label}
    </Typography>
    <Chip label={value} size="small"/>
  </Stack>
)

type LevelProgressProps = {
  level: TradeChange;
  label?: string;
}

const LevelProgress = (
  {
    level,
    label,
  }: LevelProgressProps) => {
  const {get, percentageOf} = useGame().resources;
  const resource = get(level.key);
  const percentage = percentageOf(resource.value, level.value!)
  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Typography variant="caption">{label || resource.label}</Typography>
        <Typography>{level.value}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={percentage} sx={{color: 'white'}}/>
    </>
  )
}


