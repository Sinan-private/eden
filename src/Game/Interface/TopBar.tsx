import React, {useMemo} from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
  Box,
} from "@/GameController/components"
import {
  Play,
  Pause,
  BrandGitlab,
  ShootingStar,
  FatArrowUp,
  HeartPlus,
  Thermometer,
  SignalCircle,
} from "@mynaui/icons-react";
import {styled} from "@/GameController/components/ui/styled.tsx";

export const TopBar = () => {
  return (
    <div style={{
      position: 'relative',
      minHeight: 60,
      width: '100%',
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
    </div>
  )
}

const Center = observer(() => {
  const {slaves, behemoth, mana, upstream, resources} = game();
  const {slaves_enslaved, unassigned_slaves} = slaves;
  const slaveAmount = `${unassigned_slaves.toFixed()} / ${slaves_enslaved.beautify.value}`;
  const manaAmount = `${Math.floor(mana.mana_count)} (${Math.floor(resources.getTypeSum('raw_mana'))})`;
  // const behemothAmount = `${behemoth.hp.beautify.value} (${behemoth.acid.beautify.value})`;
  const behemothHeight = `${behemoth.climb_height.beautify.value} (${upstream.height.beautify.value})`;
  // const behemothHeight = `${behemoth.climb_height.beautify.value}`;

  return (
    <TooltipProvider>
      <div className="mt-2 z-50 pointer-events-auto">
        <Box className="flex relative py-1">
          <div className="flex py-1 pl-3 pr-5 gap-8" style={{width: 380}}>
            <UIStack tooltip={(<SlavePreview/>)} Icon={(<BrandGitlab/>)}
                     value={slaveAmount}/>
            <UIStack tooltip={(<ManaPreview/>)} Icon={(<ShootingStar/>)} value={manaAmount}/>
            <UIStack tooltip="Height" Icon={(<FatArrowUp/>)} value={behemothHeight}/>
          </div>
          <PlayButton/>
          <div className="flex py-1 pl-8 pr-3 gap-8" style={{width: 380}}>
            <UIStack tooltip={(<BehemothPreview/>)} Icon={(<HeartPlus/>)}>
              <p>HP</p>
              <p>{behemoth.hp.beautify.value}</p>
            </UIStack>
            <UIStack tooltip={(<BehemothAcid/>)} Icon={(<Thermometer/>)}>
              <p>Acid</p>
              <p>{behemoth.acid.beautify.value}</p>
            </UIStack>
            <UIStack tooltip={(<BehemothStamina/>)} Icon={(<SignalCircle/>)}>
              <p>{behemoth.stamina.beautify.value}</p>
              <p>Stamina</p>
            </UIStack>
          </div>
        </Box>
      </div>
    </TooltipProvider>
  )
})

const BehemothPreview = observer(() => {

  return (
    <div className="p-2">
      Behemoth
    </div>
  )
})

const BehemothAcid = observer(() => {
  const {manaToAcid} = game().behemoth;

  return (
    <div className="p-2">
      <Button onClick={manaToAcid}>Mana to acid</Button>
    </div>
  )
})
const BehemothStamina = observer(() => {
  const {consumeWastedSlave} = game().behemoth;

  return (
    <div className="p-2">
      <Button onClick={consumeWastedSlave}>Mana to stamina</Button>
    </div>
  )
})
const SlavePreview = observer(() => {
  const {slaves} = game();
  const slaveView = useMemo(() => {
    const list: [number, string][] = [
      [slaves.unassigned_slaves, 'Unassigned'],
      [slaves.arwa, 'Diggers'],
      [slaves.marid, 'Blacksmiths'],
    ]
    return (
      <div className="p-2">
        <p className="text-2xl">Slaves</p>
        {list.map(([value, label]) => (
          <div key={label} style={{width: 240, display: 'flex', marginBottom: 8, alignItems: "center"}}>
            <p className="mr-2">{label}</p>
            <p>{value.toFixed()}</p>
          </div>
        ))}
        <p>Total slaves {slaves.slaves_enslaved.beautify.value}</p>
      </div>
    )
  }, [slaves.arwa, slaves.marid, slaves.slaves_enslaved.beautify.value, slaves.unassigned_slaves])

  return (
    <div>
      {slaveView}
    </div>
  )
})


const ManaPreview = observer(() => {
  const {resources} = game();
  const manaView = useMemo(() => {
    const raw_mana = resources.getTypeSum('raw_mana')
    const list = resources.getByType('mana')
    return (
      <div className="p-2">
        <p className="text-2xl">Mana</p>
        {list.map(({id, beautify, icon}, i) => (
          <div key={id} style={{width: 240, display: 'flex', marginBottom: 1, alignItems: "center"}}>
            <img src={icon} alt={icon}/>
            <p style={{marginRight: 16}}>Level {i + 1}</p>
            <p>{beautify.value}</p>
          </div>
        ))}
        <p>Raw mana {raw_mana}</p>
      </div>
    )
  }, [resources])

  return (
    <div>
      {manaView}
    </div>
  )
})

type UIStackProps = {
  tooltip: React.ReactNode | string;
  Icon?: React.ReactNode;
  value?: string | number;
  children?: React.ReactNode;
}

const UIStack = observer(({tooltip, Icon, value, children}: UIStackProps) => (
  <Tooltip delayDuration={200}>
    <TooltipTrigger asChild>
      <div className="flex gap-1 items-center">
        {Icon &&
          <div>{Icon}</div>
        }
        {value ?
          <p className="text-nowrap" text-align="left">{value}</p>
          : children
            ? (<>{children}</>)
            : null
        }
      </div>
    </TooltipTrigger>
    <TooltipContent>
      {tooltip}
    </TooltipContent>
  </Tooltip>
))

const PlayButton = observer(() => {
  const {
    isActive,
    start,
    stop,
  } = game().tick;
  const onClick = isActive ? stop : start;
  return (
    <PlayContainer onClick={onClick}>
      {isActive
        ? <Pause/>
        : <Play/>
      }
    </PlayContainer>
  )
})

const PlayContainer = styled(
  "absolute -top-2 left-1/2 -translate-x-1/2 cursor-pointer flex justify-center items-center w-14 h-14 rounded-[50%] bg-slate-900",
  Box
)

const Side = styled(
  "relative flex-auto h-7 pointer-events-none -z-1"
)
