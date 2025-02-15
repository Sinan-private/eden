import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {InterfaceActiveLeft} from "./InterfaceController.ts";
import React from "react";
import {FactionManager} from "./FactionManager.tsx";
import {ValueDisplay} from "./ValueDisplay.tsx";

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
    <div className="flex flex-col gap-2">
      Behemoth Settings
      <ValueDisplay resource={hp}/>
      <ValueDisplay resource={stamina}/>
      <ValueDisplay resource={acid}/>
    </div>
  )
}
