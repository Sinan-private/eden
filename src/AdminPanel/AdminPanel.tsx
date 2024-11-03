import {useEffect, useState} from "react";
import styled from "styled-components";
import {IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import BalanceIcon from '@mui/icons-material/Balance';
import CableIcon from '@mui/icons-material/Cable';
import {useGame} from "../context/game.context.ts";
import {AddResourceModal} from "./Add/AddResourceModal.tsx";
import {HandleTypes} from "./HandleTypes.tsx";
import {AddTypeModal} from "./Add/AddTypeModal.tsx";
import Box from "@mui/material/Box";
import Close from "@mui/icons-material/Close";
import {HandleResources} from "./HandleResources.tsx";
import TabNav from "./TabNav.tsx";
import {themeColors} from "../Resource/assets/colors.ts";

export const AdminPanel = () => {
  const {onCloseAdminPanel} = useGame();

  const [, setLoading] = useState(true);
  const [openNewResource, setOpenNewResource] = useState(false);
  const [openNewType, setOpenNewType] = useState(false);


  const onOpenAddResource = () => setOpenNewResource(true);
  const onOpenAddType = () => setOpenNewType(true);
  const onCloseAddCost = () => setOpenNewResource(false);
  const onCloseAddType = () => setOpenNewType(false);

  useEffect(() => {
    const handleRenderingComplete = () => {
      setLoading(false);
    };

    requestAnimationFrame(() => {
      handleRenderingComplete();
    });
  }, []);

  return (
    <StyledContainer>
      <Box position="absolute" top={10} right={10}>
        <IconButton onClick={onCloseAdminPanel} sx={{zIndex: 100}}>
          <Close/>
        </IconButton>

      </Box>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{position: 'absolute', bottom: 16, right: 16}}
        icon={<SpeedDialIcon/>}
      >
        <SpeedDialAction
          icon={<BalanceIcon/>}
          tooltipTitle="Add resource"
          onClick={onOpenAddResource}
        />
        <SpeedDialAction
          icon={<CableIcon/>}
          tooltipTitle="Add type"
          onClick={onOpenAddType}
        />
      </SpeedDial>
      <AddTypeModal open={openNewType} onClose={onCloseAddType}/>
      <AddResourceModal open={openNewResource} onClose={onCloseAddCost}/>

      <Content>
        <TabNav tabs={[
          {
            label: 'Resources',
            Component: HandleResources,
          },
          {
            label: 'Types',
            Component: HandleTypes,
          },
        ]} />
      </Content>

    </StyledContainer>
  )
}

const StyledContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    min-width: 60vw;
    background-color: ${themeColors.color1};
    box-shadow: 10px 0 74px 0 #22183887;
    z-index: 1000;
`
const Content = styled.div`
    height: 100vh;
    overflow: auto;

`