import {Box, Divider, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {observer} from "mobx-react";
import styled from "styled-components";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {useGame} from "./context/game.context.ts";
import PauseIcon from '@mui/icons-material/Pause';
import {useTurnSubscription} from "../Resource";
import LinkIcon from '@mui/icons-material/Link';
import HeightIcon from '@mui/icons-material/Height';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {useMemo} from "react";
import BugReportIcon from '@mui/icons-material/BugReport';

export const TopBar = () => {
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      minHeight: 60,
      width: '100%',
      // border: '1px solid red',
      display: 'flex',
      gap: 2,
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
  const {slave_count, max} = slaves;
  const slaveAmount = `${slave_count} / ${max}`;
  const manaAmount = `${mana.mana_count} (${mana.getTypeSum('raw_mana')})`;
  const behemothAmount = `${behemoth.hp} (${behemoth.acid})`;
  const behemothHeight = `${behemoth.climb_height.beautify.value} (${upstream.height.beautify.value})`;

  return (
    <Box sx={{flex: '1 1 500px', mt: 1.5}}>
      <Box sx={{display: 'flex', width: '100%', '*': {flex: '1 1 auto'}, position: 'relative'}}>
        <CenterUi>
          <UIStack tooltip="Slaves" Icon={(<LinkIcon sx={{transform: 'rotate(-90deg)'}} />)} value={slaveAmount} />
          <UIStack tooltip="Height" Icon={(<HeightIcon />)} value={behemothHeight} />
        </CenterUi>
        <PlayButton/>
        <CenterUi style={{paddingLeft: 32}}>
          <UIStack tooltip={(<ManaPreview />)} Icon={(<AutoAwesomeIcon />)} value={manaAmount} />
          <UIStack tooltip="Behemoth" Icon={(<BugReportIcon />)} value={behemothAmount} />
        </CenterUi>
      </Box>
    </Box>
  )
}

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
  value: string | number;
}

const UIStack = ({tooltip, Icon, value}: UIStackProps) => (
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
      <Typography align="left" fontSize="inherit" noWrap>{value}</Typography>
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
    border: 1px solid #6d8793;
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
    border: 1px solid #6d8793;
    background-color: black;
    z-index: 10000;
`

const Side = styled.div`
    flex: 1 1 auto;
    height: 20px;
    //font-size: 12px;
`;