import {game} from "@/Game";
import {Box} from "@/GameEngine/components";
import {Debug_Resource, Debug_ResourceGroup} from "@/GameEngine/Admin/Debugging/Debug_Resource.tsx";
import {Container} from "@/GameEngine/Admin/Debugging/styles.tsx";

export const Debug_Behemoth = () => {
  const {behemoth, resources} = game()
  const {digging_depth, flushing_depth, drying_delay, climb_height, climb_speed} = behemoth
  const liquid_mana = resources.getByType("liquid_mana")
  const dirty_mana = resources.getByType("dirty_mana")
  const raw_mana = resources.getByType("raw_mana")
  const clean_mana = resources.getByType("mana")

  return (
    <Container>
          <Box>
            <Debug_ResourceGroup>
              <Debug_Resource resource={climb_speed} />
              <Debug_Resource resource={climb_height}  incrementBy={500}/>
              <Debug_Resource resource={digging_depth} />
              <Debug_Resource resource={flushing_depth} />
              <Debug_Resource resource={drying_delay} />
            </Debug_ResourceGroup>
          </Box>
          <Box>
            <div className="flex gap-2">
              <Debug_ResourceGroup>
                {liquid_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource} />
                ))}
              </Debug_ResourceGroup>
              <Debug_ResourceGroup>
                {dirty_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource}  incrementBy={3}/>
                ))}
              </Debug_ResourceGroup>
              <Debug_ResourceGroup>
                {raw_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource}  incrementBy={2}/>
                ))}
              </Debug_ResourceGroup>
              <Debug_ResourceGroup>
                {clean_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource} />
                ))}
              </Debug_ResourceGroup>
            </div>
          </Box>
    </Container>
  )
}

