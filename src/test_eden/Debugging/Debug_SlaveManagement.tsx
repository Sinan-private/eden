import {useGame} from "../context/game.context.ts";
import {Box, Button, Stack} from "@mui/material";
import {Debug_CustomResource, Debug_Resource, Debug_ResourceGroup} from "./Debug_Resource.tsx";

import {Debug_Box} from "./Debug_Box.tsx";

export const Debug_SlaveManagement = ({beautifyValues}: { beautifyValues: boolean }) => {
  const {slaves} = useGame();
  return (
    <>
      <Box display="flex" gap={2}>
        <Debug_Box>
          <Debug_ResourceGroup>
            <Debug_Resource resource={slaves.slaves_bound} beautifyValues={beautifyValues} incrementBy={1}
                            decrementBy={1}/>
            <Stack direction="row" justifyContent="space-between">

              <Debug_CustomResource
                label="Rebirth"
                onIncrement={slaves.addSlaveToRebirth}
                onDecrement={slaves.revive}
                beautifyValues={beautifyValues}
                value={slaves.slaves_in_rebirth.value}
              />
              <Button onClick={slaves.resurrect} sx={{width: 100}}>Resurrect</Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Debug_Resource resource={slaves.slaves_roaming} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.revive} sx={{width: 100}}>Revive</Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Debug_Resource resource={slaves.slaves_enslaved} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.enslave} sx={{width: 100}}>Enslave</Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Debug_Resource resource={slaves.slaves_wasted} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.waste} sx={{width: 100}}>Waste</Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Debug_Resource resource={slaves.slaves_consumed} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.consume} sx={{width: 100}}>Consume</Button>
            </Stack>
          </Debug_ResourceGroup>
        </Debug_Box>
        <Debug_Box>
          <Debug_ResourceGroup>
            <Debug_Resource resource={slaves.slave_health} beautifyValues={beautifyValues} incrementBy={20}
                            decrementBy={20}/>

            <Debug_CustomResource
              label="Unassigned"
              beautifyValues={beautifyValues}
              value={slaves.unassigned_slaves}
            />
            <Debug_CustomResource
              label="Add to Ifrit"
              onIncrement={() => slaves.addToFaction('ifrit')}
              onDecrement={() => slaves.removeFromFaction('ifrit')}
              beautifyValues={beautifyValues}
              value={slaves.ifrit}
            />
            <Debug_CustomResource
              label="Add to Marid"
              onIncrement={() => slaves.addToFaction('marid')}
              onDecrement={() => slaves.removeFromFaction('marid')}
              beautifyValues={beautifyValues}
              value={slaves.marid}
            />
            <Debug_CustomResource
              label="Add to Arwa"
              onIncrement={() => slaves.addToFaction('arwa')}
              onDecrement={() => slaves.removeFromFaction('arwa')}
              beautifyValues={beautifyValues}
              value={slaves.arwa}
            />
            <Debug_CustomResource
              label="Add to Ghoul"
              onIncrement={() => slaves.addToFaction('ghoul')}
              onDecrement={() => slaves.removeFromFaction('ghoul')}
              beautifyValues={beautifyValues}
              value={slaves.ghoul}
            />
          </Debug_ResourceGroup>
        </Debug_Box>
      </Box>
    </>
  )
}