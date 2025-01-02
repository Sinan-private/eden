import {useEffect, useState} from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import Close from "@mui/icons-material/Close";
import {AdminResources} from "./Resource/AdminResources.tsx";
import TabNav from "./TabNav.tsx";
import {HandleTypes} from "./Resource/HandleTypes.tsx";
import {useAdmin} from "../context/admin.context.ts";

export const AdminPanel = () => {
  const {onCloseAdminPanel} = useAdmin();

  const [, setLoading] = useState(true);

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

        <Content>
          <TabNav tabs={[
            {
              label: 'Resources',
              // Component: HandleResources,
              Component: AdminResources,
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
    background: linear-gradient(180deg, rgb(53, 57, 70) 0%, rgba(35, 42, 60, 1) 100%);
    box-shadow: 10px 0 74px 0 #22183887;
    z-index: 1000;
`
const Content = styled.div`
    height: 100vh;
    overflow: auto;

`