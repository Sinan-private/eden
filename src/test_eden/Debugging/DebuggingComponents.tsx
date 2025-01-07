import {Stack, Switch, Typography} from "@mui/material";
import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";
import {useState} from "react";
import styled from "styled-components";
import {blue} from "../../constants/colors.ts";

export const DebuggingComponents = () => {
  const [beautifyValues, setBeautifyValues] = useState(true)
  const [show, setShow] = useState(true)
  const onSwitch = () => {
    setBeautifyValues(!beautifyValues)
  }

  return (
    <Container>
      <Stack sx={{
        position: 'relative',
        pointerEvents: 'initial',
        zIndex: 1000,
        width: 200,
        maxWidth: '20%'
      }}>

        <Stack
          direction="row"
          alignItems="center"
        >
          <Switch onChange={() => setShow(!show)} checked={show}/>
          <Typography>Debug</Typography>
        </Stack>
        {show &&
          <Stack
            direction="row"
            alignItems="center"


            // sx={{position: 'absolute', top: 40, left: 10, zIndex: 100}}
          >
            <Switch onChange={onSwitch} checked={beautifyValues}/>
            <Typography>Beautify values</Typography>
          </Stack>
        }
      </Stack>
      {show &&
        <Child>
            <Debug_Behemoth beautifyValues={beautifyValues}/>
            <Debug_SlaveManagement beautifyValues={beautifyValues}/>
        </Child>
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
    //border: 1px solid red;
    z-index: 5000;
`;

const Child = styled.div`
    pointer-events: initial;
    z-index: 1000;
    padding: 30px 100px;
`

export const Debug_Box = styled.div`
    border: 1px solid ${blue};
    margin: 0 8px 8px 0;
    background-color: #17212a91;
    padding: 4px 8px;
    border-radius: 4px;
}
`