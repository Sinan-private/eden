import React from "react";
import {Debug_BehemothControls} from "../Debugging/Debug_BehemothControls.tsx";
import {TopBar} from "./TopBar.tsx";
import {SlaveManager} from "../Components/SlaveManager.tsx";
import styled from "styled-components";
import {FooterButtons} from "./FooterButtons.tsx";
import {SidebarContent} from "./SidebarContent.tsx";
import {useGame} from "../context/game.context.ts";
import {InterfaceActiveLeft} from "./InterfaceController.ts";
import {observer} from "mobx-react";
import {grey_blue} from "../../constants/colors.ts";
import {Box, Button, Stack, Typography} from "@mui/material";

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
        <SlaveManager/>
      </Right>
      <Footer>
        <FooterButtons/>
        <Debug_BehemothControls/>
      </Footer>
    </Grid>
  )
}

const SidebarExtension = observer(() => {
  const {selectionActiveLeft} = useGame().ui;
  const sidebarContent: Record<Exclude<InterfaceActiveLeft, null>, React.ReactNode> = {
    faction: (<FactionMain/>),
    player: (<PlayerMain/>),
    behemoth: (<BehemothMain/>),
  }
  return selectionActiveLeft ? sidebarContent[selectionActiveLeft] : null
})

const FactionMain = () => (
  <>
    Faction main
  </>
)

// Todo the trade should also accept changes to the min and max.
//  In general it seems to be good to accept a raw_resource to allow overwriting even things like the cost, the type or possibly the label (e.g. adding 'Master')

const PlayerMain = observer(() => {
  const {trade} = useGame().resources
  const onClick = () =>
    trade([{key: 'behemoth_hp', max: 20}], [{key: 'behemoth_acid', value: 100}], 10).tradeIfPossible()
  return (
    <>
      Player main
      <button onClick={onClick}>test level up</button>
    </>
  )
})

const BehemothMain = observer(() => {
  const {level, meets_level_requirements} = useGame().behemoth;
  // console.log(meetsLevelRequirements());
  return(
    <Box p={2}>
      <Card>
        <Typography variant="h5">Behemoth</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Level {level}</Typography>
        <Button disabled={!meets_level_requirements}>Level up</Button>
        </Stack>
      </Card>
    </Box>
  )
})

const Card = styled.div`
    border: 1px solid ${grey_blue};
    margin: 0 8px 8px 0;
    background-color: #17212a91;
    padding: 4px 8px;
    border-radius: 4px;
`

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
