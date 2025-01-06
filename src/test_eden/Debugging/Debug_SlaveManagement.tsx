import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {Box, Button, Stack, Typography} from "@mui/material";
import {SlaveCount} from "../Components/SlaveCount.tsx";
import {Debug} from "../Components/Debug.tsx";
import {Debug_CustomResource, Debug_Resource, Debug_ResourceGroup} from "./Debug_Resource.tsx";

export const Debug_SlaveManagement = observer(() => {
  const {slaves} = useGame();
  return (
    <Debug>
      <Box display="flex" gap={2}>
        <Debug_ResourceGroup>

          <Debug_Resource resource={slaves.slaves_bound} beautifyValues={true} incrementBy={1} decrementBy={1}/>
          <Debug_CustomResource
            label="Rebirth"
            onIncrement={slaves.addSlaveToRebirth}
            onDecrement={slaves.revive}
            beautifyValues={true}
            value={slaves.slaves_in_rebirth}
          />
          <Debug_Resource resource={slaves.slaves_roaming} beautifyValues={true} incrementBy={1} decrementBy={1}/>
          <Debug_Resource resource={slaves.slaves_enslaved} beautifyValues={true} incrementBy={1} decrementBy={1}/>
          <Debug_Resource resource={slaves.slaves_wasted} beautifyValues={true} incrementBy={1} decrementBy={1}/>
          <Debug_Resource resource={slaves.slaves_consumed} beautifyValues={true} incrementBy={1} decrementBy={1}/>
          <Debug_Resource resource={slaves.slave_health} beautifyValues={true} incrementBy={20} decrementBy={20}/>
        </Debug_ResourceGroup>
        <Debug_ResourceGroup>
          <Debug_CustomResource
            label="Unassigned"
            beautifyValues={true}
            value={slaves.unassigned_slaves}
          />
          <Debug_CustomResource
            label="Add to Ifrit"
            onIncrement={() => slaves.addToFaction('ifrit')}
            onDecrement={() => slaves.removeFromFaction('ifrit')}
            beautifyValues={true}
            value={slaves.ifrit}
          />
          <Debug_CustomResource
            label="Add to Marid"
            onIncrement={() => slaves.addToFaction('marid')}
            onDecrement={() => slaves.removeFromFaction('marid')}
            beautifyValues={true}
            value={slaves.marid}
          />
          <Debug_CustomResource
            label="Add to Arwa"
            onIncrement={() => slaves.addToFaction('arwa')}
            onDecrement={() => slaves.removeFromFaction('arwa')}
            beautifyValues={true}
            value={slaves.arwa}
          />
          <Debug_CustomResource
            label="Add to Ghoul"
            onIncrement={() => slaves.addToFaction('ghoul')}
            onDecrement={() => slaves.removeFromFaction('ghoul')}
            beautifyValues={true}
            value={slaves.ghoul}
          />
          <Button onClick={slaves.waste}>waste</Button>
          <Button onClick={slaves.consume}>Consume</Button>
        </Debug_ResourceGroup>
        {/*<Debug_CustomResource*/}
        {/*  label="Slaves"*/}
        {/*  onIncrement={slaves.enslave}*/}
        {/*  onDecrement={slaves.waste}*/}
        {/*  beautifyValues={true}*/}
        {/*  value={slaves.unassigned_slaves}*/}
        {/*/>*/}
        {/*<Typography variant="h5" mb={2}>Slaves</Typography>*/}
        {/*<Stack direction="row" alignItems="center">*/}
        {/*  <Button onClick={() => slaves.waste()} size="small">-</Button>*/}
        {/*  <SlaveCount/>*/}
        {/*  <Button onClick={() => slaves.enslave()}>+</Button>*/}
        {/*</Stack>*/}
        {/*<Stack direction="row" alignItems="center">*/}
        {/*  <Typography align="center" sx={{width: '100%'}}>Unassigned {slaves.unassigned_slaves}</Typography>*/}
        {/*</Stack>*/}
        {/*<Stack direction="row" alignItems="center">*/}
        {/*  <Button onClick={() => slaves.takeFromFaction('arwa', 1)}>-</Button>*/}
        {/*  <Typography>Diggers {slaves.arwa}</Typography>*/}
        {/*  <Button onClick={() => slaves.giveToFaction('arwa', 1)}>+</Button>*/}
        {/*</Stack>*/}
        {/*<Stack direction="row" alignItems="center">*/}
        {/*  <Button onClick={() => slaves.takeFromFaction('marid', 1)}>-</Button>*/}
        {/*  <Typography>Blacksmiths {slaves.marid}</Typography>*/}
        {/*  <Button onClick={() => slaves.giveToFaction('marid', 1)}>+</Button>*/}
        {/*</Stack>*/}
        {/*<Button onClick={() => slaves.waste()} color="error">Waste slave</Button>*/}
      </Box>
    </Debug>
  )
})