import {observer} from "mobx-react";
import {useGame} from "./context/game.context.ts";
import {Button, Stack, Typography} from "@mui/material";
import {SlaveCount} from "./SlaveCount.tsx";
import {Debug} from "./Components/Debug.tsx";

export const Debug_SlaveManagement = observer(() => {
  const {slaves} = useGame();
  return (
    <Debug>
      <Typography variant="h5" mb={2} onClick={() => slaves.addSlave()}>Slaves</Typography>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.wasteSlave()}>-</Button>
        <SlaveCount/>
        <Button onClick={() => slaves.addSlave()}>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography align="center" sx={{width: '100%'}}>Unassigned {slaves.slave_unassigned}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.unassignSlaves('digger', 1)}>-</Button>
        <Typography>Diggers {slaves.slave_diggers}</Typography>
        <Button onClick={() => slaves.assignSlaves('digger', 1)}>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.unassignSlaves('blacksmith', 1)}>-</Button>
        <Typography>Blacksmiths {slaves.slave_blacksmiths}</Typography>
        <Button onClick={() => slaves.assignSlaves('blacksmith', 1)}>+</Button>
      </Stack>
      <Button onClick={() => slaves.wasteSlave()} color="error">Waste slave</Button>
    </Debug>
  )
})