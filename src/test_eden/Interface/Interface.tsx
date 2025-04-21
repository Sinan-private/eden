import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {Debug_BehemothControls} from "@/test_eden/debug/custom/Debug_BehemothControls.tsx";
import {TopBar} from "./TopBar.tsx";
import {FooterButtons} from "./FooterButtons.tsx";
import {SidebarContent} from "./SidebarContent.tsx";
import {InterfaceActiveLeft} from "./InterfaceController.ts";
import {BehemothManager} from "./BehemothManager.tsx";
import {PlayerManager} from "./PlayerManager.tsx";
import {Button} from "@/Game/components/ui/button.tsx";
import {EarthContent} from "@/test_eden/Interface/EarthContent.tsx";
import {game} from "@/test_eden/Classes/Game";

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
        <EarthContent />
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
  const {produce} = game().resources
  const testProduce = () => produce('raw_mana_level_1', 0.35)
  // const testProduce = () => get('dirty_mana_level_1').updateValueBy(0.2)
  return (
    <>
      Faction main
      <Button onClick={testProduce}>Testing</Button>
    </>
  )
})

const Grid = styled.div`
    position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-rows: ${HEADER_HEIGHT}px 1fr ${FOOTER_HEIGHT}px;
    grid-template-columns: 160px 1fr 100px 0.7fr;
    //border: 1px solid red;
    z-index: 500;
    grid-template-areas:
    "header header header header"
    "sidebar sidebar_extention spacer main"
    "footer footer footer footer";
    & div {
        pointer-events: initial;
    }
`
const Header = styled.header`
    grid-area: header;
    //border: 1px solid #535bf2;
`
const SideBar = styled.div`
    //border: 1px solid #535bf2;
    grid-area: sidebar;
    padding: 12px;
`
const SideBarExtension = styled.div`
    //border: 1px solid #535bf2;
    grid-area: sidebar_extention;
`
const Footer = styled.footer`
    display: flex;
    //border: 1px solid #535bf2;
    grid-area: footer;
`
const Right = styled.footer`
    grid-area: main;
`
const Spacer = styled.footer`
    grid-area: spacer;
`
