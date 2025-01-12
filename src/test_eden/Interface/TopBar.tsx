import {useMemo} from "react";
import {Box, Button, Divider, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {observer} from "mobx-react";
import styled from "styled-components";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LinkIcon from '@mui/icons-material/Link';
import HeightIcon from '@mui/icons-material/Height';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BugReportIcon from '@mui/icons-material/BugReport';
import {useGame} from "../context/game.context.ts";
import {useTurnSubscription} from "../../Resource";
import {grey_blue} from "../../constants/colors.ts";

export const TopBar = () => {
  return (
    <Box sx={{
      position: 'relative',
      // top: -10,
      // left: 0,
      minHeight: 60,
      width: '100%',
      // border: '1px solid red',
      display: 'flex',
      gap: 2,
      pointerEvents: 'none',
      zIndex: 500,
    }}>
      <Side>
      </Side>
      <Center/>
      <Side>
      </Side>
    </Box>
  )
}

const Center = () => {
  const {slaves, behemoth, mana, upstream} = useGame();
  const {slaves_enslaved, unassigned_slaves} = slaves;
  const slaveAmount = `${unassigned_slaves} / ${slaves_enslaved.beautify.value}`;
  const manaAmount = `${mana.mana_count} (${mana.getTypeSum('raw_mana')})`;
  // const behemothAmount = `${behemoth.hp.beautify.value} (${behemoth.acid.beautify.value})`;
  const behemothHeight = `${behemoth.climb_height.beautify.value} (${upstream.height.beautify.value})`;
  // const behemothHeight = `${behemoth.climb_height.beautify.value}`;

  return (
    <Box sx={{flex: '1 1 500px', mt: 1.5, position: 'relative', pointerEvents: 'initial', zIndex: 100}}>
      <Box sx={{display: 'flex', width: '100%', '*': {flex: '1 1 auto'}, position: 'relative'}}>
        <CenterUi>
          <UIStack tooltip={(<SlavePreview />)} Icon={(<LinkIcon sx={{transform: 'rotate(-90deg)'}} />)} value={slaveAmount} />
          <UIStack tooltip={(<ManaPreview />)} Icon={(<AutoAwesomeIcon />)} value={manaAmount} />
          <UIStack tooltip="Height" Icon={(<HeightIcon />)} value={behemothHeight} />
        </CenterUi>
        <PlayButton/>
        <CenterUi style={{paddingLeft: 32}}>
          <UIStack tooltip={(<BehemothPreview />)} Icon={(<BugReportIcon />)}>
            <Typography>HP</Typography>
            <Typography>{behemoth.hp.beautify.value}</Typography>
            <Typography>Stamina</Typography>
            <Typography>{behemoth.stamina.beautify.value}</Typography>
            <Typography>Acid</Typography>
            <Typography>{behemoth.acid.beautify.value}</Typography>

          </UIStack>
        </CenterUi>
      </Box>
    </Box>
  )
}

const BehemothPreview = observer(() => {
  const {manaToAcid} = useGame().behemoth;

  return (
    <Box p={2}>
      Behemoth
      <Button onClick={manaToAcid}>Mana to acid</Button>
    </Box>
  )
})

const SlavePreview = observer(() => {
  const {slaves} = useGame();
  const slaveView = useMemo(() => {
    const list: [number, string][] = [
      [slaves.unassigned_slaves, 'Unassigned'],
      [slaves.arwa, 'Diggers'],
      [slaves.marid, 'Blacksmiths'],
    ]
    return (
      <Box p={2}>
        <Typography variant="h5">Slaves</Typography>
        {list.map(([value, label]) => (
          <Box key={label} sx={{width: 240, display: 'flex', mb: 1, alignItems: "center"}}>
            <Typography sx={{mr: 2}} variant="caption">{label}</Typography>
            <Typography>{value}</Typography>
          </Box>
        ))}
        <Divider sx={{my: 2}} />
        <Typography>Total slaves {slaves.slaves_enslaved.beautify.value}</Typography>
      </Box>
    )
  }, [slaves.arwa, slaves.marid, slaves.slaves_enslaved.beautify.value, slaves.unassigned_slaves])

  return (
    <Box>
      {slaveView}
    </Box>
  )
})



const ManaPreview = observer(() => {
  const {resources, mana} = useGame();
    const raw_mana = mana.getTypeSum('raw_mana')
  const manaView = useMemo(() => {
    const list = resources.getByType('mana')
    return (
      <Box p={2}>
        <Typography variant="h5">Mana</Typography>
        {list.map(({id, beautify, icon}, i) => (
          <Box key={id} sx={{width: 240, display: 'flex', mb: 1, alignItems: "center"}}>
            <img src={icon} alt={icon} />
            <Typography sx={{mr: 2}} variant="caption">Level {i + 1}</Typography>
            <Typography>{beautify.value}</Typography>
          </Box>
        ))}
        <Divider sx={{my: 2}} />
        <Typography>Raw mana {raw_mana}</Typography>
      </Box>
    )
  }, [raw_mana, resources])

  return (
    <Box>
      {manaView}
    </Box>
  )
})

type UIStackProps = {
  tooltip: React.ReactNode | string;
  Icon: React.ReactNode;
  value?: string | number;
  children?: React.ReactNode;
}

const UIStack = ({tooltip, Icon, value, children}: UIStackProps) => (
  <Tooltip title={tooltip}>
    <Stack direction="row" gap={1} sx={{
      alignItems: 'center',
      flexGrow: 0.5,
      justifyContent: 'center',
      'div': {
        flex: '0 0 30px'
      },
    }}>
      <CenterContent>{Icon}</CenterContent>
      {value ?
          <Typography align="left" fontSize="inherit" noWrap>{value}</Typography>
        : children
          ? (<>{children}</>)
          : null
      }
    </Stack>
  </Tooltip>
)

const PlayButton = () => {
  const {
    isActive,
    start,
    stop,
  } = useTurnSubscription();
  const onClick = isActive ? stop : start;
  return (
    <PlayContainer onClick={onClick}>
      {isActive
        ? <PauseIcon/>
        : <PlayArrowIcon/>
      }
    </PlayContainer>
  )
}


const CenterContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CenterUi = styled(Paper)`
    display: flex;
    align-items: center;
    width: 300px;
    border: 1px solid ${grey_blue};
    font-size: 14px;
    gap: 24px;
`;

const PlayContainer = styled(Box)`
    position: absolute;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${grey_blue};
    //border: 1px solid #6d8793;
    background-color: black;
    z-index: 1000;
`

const Side = styled.div`
    position: relative;
    flex: 1 1 auto;
    height: 30px;
    pointer-events: none;
    z-index: -1;
    //font-size: 12px;
`;
