import {Debug_CustomResource, Debug_Resource, Debug_ResourceGroup} from "./Debug_Resource.tsx";

import {Box, Button as RawButton} from "@/components/ui";
import {Container} from "@/components/ui/Box.tsx";
import {game} from "@/test_eden/context/createSingletonGame.ts";

const Button = ({onClick, children}: {onClick(): void; children: string}) => (
  <RawButton onClick={() => onClick()} className="w-[100px]" variant="outline">
    {children}
  </RawButton>
)

export const Debug_SlaveManagement = ({beautifyValues}: { beautifyValues: boolean }) => {
  const {slaves} = game();
  return (
    <Container>
        <Box>
          <Debug_ResourceGroup>
            <Debug_Resource resource={slaves.slaves_bound} beautifyValues={beautifyValues} incrementBy={1}
                            decrementBy={1}/>
            <div className="flex justify-between">

              <Debug_CustomResource
                label="Rebirth"
                onIncrement={slaves.addSlaveToRebirth}
                onDecrement={slaves.revive}
                beautifyValues={beautifyValues}
                value={slaves.slaves_in_rebirth.value}
              />
              <Button onClick={slaves.resurrect}>Resurrect</Button>
            </div>
            <div className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_roaming} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.revive}>Revive</Button>
            </div>
            <div  className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_enslaved} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.enslave}>Enslave</Button>
            </div>
            <div  className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_wasted} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.waste}>Waste</Button>
            </div>
            <div  className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_consumed} beautifyValues={beautifyValues} incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.consume}>Consume</Button>
            </div>
          </Debug_ResourceGroup>
        </Box>
        <Box>
          <Debug_ResourceGroup>
            <Debug_Resource
              resource={slaves.slave_health}
              beautifyValues={beautifyValues}
              incrementBy={20}
              decrementBy={20}
            />

            <Debug_CustomResource
              label="Unassigned"
              beautifyValues={beautifyValues}
              value={slaves.unassigned_slaves}
            />
            <Debug_CustomResource
              label="Add to Ifrit"
              onIncrement={() => slaves.assignToFaction('ifrit')}
              onDecrement={() => slaves.removeFromFaction('ifrit')}
              beautifyValues={beautifyValues}
              value={slaves.ifrit}
            />
            <Debug_CustomResource
              label="Add to Marid"
              onIncrement={() => slaves.assignToFaction('marid')}
              onDecrement={() => slaves.removeFromFaction('marid')}
              beautifyValues={beautifyValues}
              value={slaves.marid}
            />
            <Debug_CustomResource
              label="Add to Arwa"
              onIncrement={() => slaves.assignToFaction('arwa')}
              onDecrement={() => slaves.removeFromFaction('arwa')}
              beautifyValues={beautifyValues}
              value={slaves.arwa}
            />
            <Debug_CustomResource
              label="Add to Ghoul"
              onIncrement={() => slaves.assignToFaction('ghoul')}
              onDecrement={() => slaves.removeFromFaction('ghoul')}
              beautifyValues={beautifyValues}
              value={slaves.ghoul}
            />
          </Debug_ResourceGroup>
        </Box>
    </Container>
  )
}