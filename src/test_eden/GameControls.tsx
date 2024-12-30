import {Button, Divider, Stack} from "@mui/material";
import styled from "styled-components";

export const GameControls = () => {

  return (
    <StyledGameControls>
      <Stack direction="row">
        <Button>Climb</Button>
        <Divider orientation="vertical" flexItem />
        <Button>ma</Button>
      </Stack>
    </StyledGameControls>
  )
};

const StyledGameControls = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    //border: 1px solid red;
    padding: 8px 12px;
`