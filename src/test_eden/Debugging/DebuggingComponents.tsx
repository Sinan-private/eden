import {Box, Stack, Switch, Typography} from "@mui/material";
import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";
import {useState} from "react";
import {Debug} from "../Components/Debug.tsx";
import styled from "styled-components";

export const DebuggingComponents = () => {
  const [beautifyValues, setBeautifyValues] = useState(true)
  const [show, setShow] = useState(true)
  const onSwitch = () => {
    setBeautifyValues(!beautifyValues)
  }

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        sx={{position: 'absolute', top: 10, left: 10, zIndex: 100, pointerEvents: 'initial'}}
      >
        <Switch onChange={() => setShow(!show)} checked={show} />
        <Typography>Debug</Typography>
      </Stack>
      {show &&
        <Debug>
          <Stack
            direction="row"
            alignItems="center"
            sx={{position: 'absolute', top: 40, left: 10, zIndex: 100}}
          >
            <Switch onChange={onSwitch} checked={beautifyValues}/>
            <Typography>Beautify values</Typography>
          </Stack>
          <Box sx={{position: 'absolute', bottom: 50, left: 10}}>
            <Debug_Behemoth beautifyValues={beautifyValues}/>
          </Box>
          <Box sx={{position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', zIndex: 1}}>
            <Debug_SlaveManagement beautifyValues={beautifyValues}/>
          </Box>
        </Debug>
      }
    </Container>
  )
}

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 1px solid red;
    z-index: 5000;
`;