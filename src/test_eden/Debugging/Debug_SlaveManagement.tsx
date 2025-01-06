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
          <Stack direction="row" justifyContent="space-between">

            <Debug_CustomResource
              label="Rebirth"
              onIncrement={slaves.addSlaveToRebirth}
              onDecrement={slaves.revive}
              beautifyValues={true}
              value={slaves.slaves_in_rebirth}
            />
            <Button onClick={slaves.resurrect} sx={{width: 100}}>Resurrect</Button>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Debug_Resource resource={slaves.slaves_roaming} beautifyValues={true} incrementBy={1} decrementBy={1}/>
            <Button onClick={slaves.revive} sx={{width: 100}}>Revive</Button>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Debug_Resource resource={slaves.slaves_enslaved} beautifyValues={true} incrementBy={1} decrementBy={1}/>
            <Button onClick={slaves.enslave} sx={{width: 100}}>Enslave</Button>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Debug_Resource resource={slaves.slaves_wasted} beautifyValues={true} incrementBy={1} decrementBy={1}/>
            <Button onClick={slaves.waste} sx={{width: 100}}>Waste</Button>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Debug_Resource resource={slaves.slaves_consumed} beautifyValues={true} incrementBy={1} decrementBy={1}/>
            <Button onClick={slaves.consume} sx={{width: 100}}>Consume</Button>
          </Stack>
        </Debug_ResourceGroup>

        <Debug_ResourceGroup>
          <Debug_Resource resource={slaves.slave_health} beautifyValues={true} incrementBy={20} decrementBy={20}/>

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
        </Debug_ResourceGroup>

      </Box>
    </Debug>
  )
})