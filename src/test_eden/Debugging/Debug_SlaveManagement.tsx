import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {Button, Stack, Typography} from "@mui/material";
import {SlaveCount} from "../Components/SlaveCount.tsx";
import {Debug} from "../Components/Debug.tsx";

export const Debug_SlaveManagement = observer(() => {
  // const {slaves} = useGame();
  const slaves = useGame().slaves;
  return (
    <Debug>
      <Typography variant="h5" mb={2}>Slaves</Typography>
      <Stack direction="row" alignItems="center">
        <Button onClick={() => slaves.waste()}>-</Button>
        <SlaveCount/>
        <Button onClick={() => slaves.enslave()}>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography align="center" sx={{width: '100%'}}>Unassigned {slaves.unassigned_slaves}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        {/*<Button onClick={() => slaves.unassignSlaves('digger', 1)}>-</Button>*/}
        <Typography>Diggers {slaves.owned_by_arwa}</Typography>
        <Button onClick={() => slaves.giveToFaction('arwa', 1)}>+</Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        {/*<Button onClick={() => slaves.unassignSlaves('blacksmith', 1)}>-</Button>*/}
        <Typography>Blacksmiths {slaves.owned_by_marid}</Typography>
        <Button onClick={() => slaves.giveToFaction('marid', 1)}>+</Button>
      </Stack>
      <Button onClick={() => slaves.waste()} color="error">Waste slave</Button>
    </Debug>
  )
})