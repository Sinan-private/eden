import {game} from "@/Game";
import {Box, Button} from "@/GameEngine/components";
import {Container} from "@/GameEngine/Admin/Debugging/styles.tsx";
import {Debug_CustomResource, Debug_Resource, Debug_ResourceGroup} from "@/GameEngine/Admin/Debugging/Debug_Resource.tsx";

export const Debug_SlaveManagement = () => {
  const {slaves} = game();
  return (
    <Container>
        <Box>
          <Debug_ResourceGroup>
            <Debug_Resource resource={slaves.slaves_bound}  incrementBy={1}
                            decrementBy={1}/>
            <div className="flex justify-between">

              <Debug_CustomResource
                label="Rebirth"
                onIncrement={slaves.addSlaveToRebirth}
                onDecrement={slaves.revive}
                value={slaves.slaves_in_rebirth.value}
              />
              <Button onClick={() => slaves.resurrect()}>Resurrect</Button>
            </div>
            <div className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_roaming}  incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={() => slaves.revive()}>Revive</Button>
            </div>
            <div  className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_enslaved}  incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.enslave}>Enslave</Button>
            </div>
            <div  className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_wasted}  incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.waste}>Waste</Button>
            </div>
            <div  className="flex justify-between">
              <Debug_Resource resource={slaves.slaves_consumed}  incrementBy={1}
                              decrementBy={1}/>
              <Button onClick={slaves.consume}>Consume</Button>
            </div>
          </Debug_ResourceGroup>
        </Box>
        <Box>
          <Debug_ResourceGroup>
            <Debug_Resource
              resource={slaves.slave_health}
              incrementBy={20}
              decrementBy={20}
            />

            <Debug_CustomResource
              label="Unassigned"
              value={slaves.unassigned_slaves}
            />
            <Debug_CustomResource
              label="Add to Ifrit"
              onIncrement={() => slaves.assignToFaction('ifrit')}
              onDecrement={() => slaves.removeFromFaction('ifrit')}
              value={slaves.ifrit}
            />
            <Debug_CustomResource
              label="Add to Marid"
              onIncrement={() => slaves.assignToFaction('marid')}
              onDecrement={() => slaves.removeFromFaction('marid')}
              value={slaves.marid}
            />
            <Debug_CustomResource
              label="Add to Arwa"
              onIncrement={() => slaves.assignToFaction('arwa')}
              onDecrement={() => slaves.removeFromFaction('arwa')}
              value={slaves.arwa}
            />
            <Debug_CustomResource
              label="Add to Ghoul"
              onIncrement={() => slaves.assignToFaction('ghoul')}
              onDecrement={() => slaves.removeFromFaction('ghoul')}
              value={slaves.ghoul}
            />
          </Debug_ResourceGroup>
        </Box>
    </Container>
  )
}
