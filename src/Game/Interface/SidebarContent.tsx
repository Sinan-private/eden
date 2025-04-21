import React from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {FactionManager} from "./FactionManager.tsx";
import {ValueDisplay} from "./ValueDisplay.tsx";
import {InterfaceActiveLeft} from "./InterfaceController.ts";

export const SidebarContent = observer(() => {
  const {selectionActiveLeft} = game().interface;
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
  const {hp, acid, stamina} = game().behemoth;
  return (
    <div className="flex flex-col gap-2">
      Behemoth Settings
      <ValueDisplay resource={hp}/>
      <ValueDisplay resource={stamina}/>
      <ValueDisplay resource={acid}/>
    </div>
  )
}
