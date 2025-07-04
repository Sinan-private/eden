import React from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {TopBar} from "./TopBar.tsx";
import {FooterButtons} from "./FooterButtons.tsx";
import {Debug_BehemothControls} from "@/Game/debug/custom/Debug_BehemothControls.tsx";
import {SidebarContent} from "./SidebarContent.tsx";
import {BehemothManager} from "./BehemothManager.tsx";
import {PlayerManager} from "./PlayerManager.tsx";
import {EarthContent} from "@/Game/Interface/EarthContent.tsx";
import {InterfaceActiveLeft} from "./InterfaceController.ts";

const HEADER_HEIGHT = 60;
export const FOOTER_HEIGHT = 80;


export const Interface = () => {

  return (
    <Grid>
      <Header>
        <TopBar/>
      </Header>
      <SideBar>
        <SidebarContent/>
      </SideBar>
      <SideBarExtension>
        <SidebarExtension/>
      </SideBarExtension>
      <Spacer/>
      <Right>
        <EarthContent/>
      </Right>
      <Footer>
        <FooterButtons/>
        <Debug_BehemothControls/>
      </Footer>
    </Grid>
  )
}

const SidebarExtension = observer(() => {
  const {selectionActiveLeft} = game().interface;
  const sidebarContent: Record<Exclude<InterfaceActiveLeft, null>, React.ReactNode> = {
    faction: (<FactionMain/>),
    player: (<PlayerManager/>),
    behemoth: (<BehemothManager/>),
  }
  return selectionActiveLeft ? sidebarContent[selectionActiveLeft] : null
})

const FactionMain = observer(() => {
  // const {produce} = game().resources
  // const testProduce = () => produce('raw_mana_level_1', 0.35)
  // const testProduce = () => get('dirty_mana_level_1').updateValueBy(0.2)
  return (
    <>
      {/*Faction main*/}
      {/*<Button onClick={testProduce}>Testing</Button>*/}
    </>
  )
})

const Grid = ({children}: { children: React.ReactNode }) => (
  <div id="Game Grid" className="
    fixed top-0 left-0 z-[500]
    pointer-events-none
    grid
    w-screen h-screen
  "
       style={{
         transform: 'none', opacity: 1,
         gridTemplateRows: `${HEADER_HEIGHT}px 1fr ${FOOTER_HEIGHT}px`,
         gridTemplateColumns: '160px 1fr 100px 0.7fr',
         gridTemplateAreas: `
        "header header header header"
        "sidebar sidebar_extension spacer main"
        "footer footer footer footer"
      `,
       }}
  >
    {children}
  </div>
)

const Header = ({children}: { children: React.ReactNode }) => (
  <div style={{gridArea: 'header'}} className="*:pointer-events-auto">
    {children}
  </div>
)

const SideBar = ({children}: { children: React.ReactNode }) => (
  <div style={{gridArea: 'sidebar'}} className="p-3">
    {children}
  </div>
)
const SideBarExtension = ({children}: { children: React.ReactNode }) => (
  <div style={{gridArea: 'sidebar_extension'}} className="*:pointer-events-auto">
    {children}
  </div>
)
const Footer = ({children}: { children: React.ReactNode }) => (
  <div style={{gridArea: 'footer'}} className="flex *:pointer-events-auto">
    {children}
  </div>
)
const Right = ({children}: { children: React.ReactNode }) => (
  <div style={{gridArea: 'main'}}>
    {children}
  </div>
)
const Spacer = () => (
  <div style={{gridArea: 'spacer'}}>
  </div>
)
