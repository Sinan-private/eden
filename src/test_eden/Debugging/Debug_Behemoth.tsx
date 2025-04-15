import {useGame} from "../context/game.context.ts";
import {Debug_Resource, Debug_ResourceGroup} from "./Debug_Resource.tsx";
import {Box} from "@/components/ui";

export const Debug_Behemoth = ({beautifyValues}: { beautifyValues: boolean }) => {
  const {behemoth, resources} = useGame()
  const {digging_depth, flushing_depth, drying_delay, climb_height, climb_speed} = behemoth
  const liquid_mana = resources.getByType("liquid_mana")
  const dirty_mana = resources.getByType("dirty_mana")
  const raw_mana = resources.getByType("raw_mana")
  const clean_mana = resources.getByType("mana")

  return (
    <>
      <div className="font-mono text-[12px]">
        <div className="flex gap-2">
          <Box>
            <Debug_ResourceGroup>
              <Debug_Resource resource={climb_speed} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={climb_height} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={digging_depth} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={flushing_depth} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={drying_delay} beautifyValues={beautifyValues}/>
            </Debug_ResourceGroup>
          </Box>
          <Box>
            <div className="flex gap-2">
              <Debug_ResourceGroup>
                {liquid_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues}/>
                ))}
              </Debug_ResourceGroup>
              <Debug_ResourceGroup>
                {dirty_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues} incrementBy={3}/>
                ))}
              </Debug_ResourceGroup>
              <Debug_ResourceGroup>
                {raw_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues} incrementBy={2}/>
                ))}
              </Debug_ResourceGroup>
              <Debug_ResourceGroup>
                {clean_mana.map((resource) => (
                  <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues}/>
                ))}
              </Debug_ResourceGroup>
            </div>
          </Box>
        </div>
      </div>
    </>
  )
}

