import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {InterfaceActiveLeft} from "./InterfaceController.ts";
import React from "react";
import {FactionManager} from "./FactionManager.tsx";
import {Box, LinearProgress, Paper, Typography} from "@mui/material";
import {ResourceClass} from "../../Resource";

export const SidebarContent = observer(() => {
  const {selectionActiveLeft} = useGame().ui;
  const sidebarContent: Record<Exclude<InterfaceActiveLeft, null>, React.ReactNode> = {
    faction: (<FactionManager/>),
    player: (<PlayerSettings/>),
    behemoth: (<BehemothSettings/>),
  }
  return selectionActiveLeft ? sidebarContent[selectionActiveLeft] : null
})
const PlayerSettings = () => {

  return (
    <>
      Player Settings
    </>
  )
}
const BehemothSettings = () => {
  const {hp, acid, stamina} = useGame().behemoth;
  return (
    <>
      Behemoth Settings
      <ValueDisplay resource={hp}/>
      <ValueDisplay resource={stamina}/>
      <ValueDisplay resource={acid}/>
    </>
  )
}
type ValueDisplayProps = {
  resource: ResourceClass;
  label?: string;
}
const ValueDisplay = observer(({resource, label = resource.label}: ValueDisplayProps) => (
  <Paper>
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <Typography variant="caption">{label}</Typography>
      <Typography>{resource.beautify.value}</Typography>
    </Box>
    <LinearProgress variant="determinate" value={resource.percentage} sx={{color: 'white'}}/>
  </Paper>
))