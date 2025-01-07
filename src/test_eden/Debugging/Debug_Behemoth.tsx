import {useGame} from "../context/game.context.ts";
import {Box} from "@mui/material";
import {Debug_Resource, Debug_ResourceGroup} from "./Debug_Resource.tsx";
import {Debug_Box} from "./DebuggingComponents.tsx";

export const Debug_Behemoth = ({beautifyValues}: { beautifyValues: boolean }) => {
  const {behemoth, resources} = useGame()
  const {digging_depth, flushing_depth, drying_delay, climb_height, climb_speed} = behemoth
  const liquid_mana = resources.getByType("liquid_mana")
  const dirty_mana = resources.getByType("dirty_mana")
  const raw_mana = resources.getByType("raw_mana")

  return (
    <>
      <Box sx={{fontFamily: 'monospace', fontSize: '12px', color: '#79ae79'}}>
        <Box display="flex" gap={2}>
          <Debug_Box>
            <Debug_ResourceGroup>
              <Debug_Resource resource={climb_speed} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={climb_height} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={digging_depth} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={flushing_depth} beautifyValues={beautifyValues}/>
              <Debug_Resource resource={drying_delay} beautifyValues={beautifyValues}/>
            </Debug_ResourceGroup>
          </Debug_Box>
          <Debug_Box>
            <Box display="flex" gap={2}>
            <Debug_ResourceGroup>
              {liquid_mana.map((resource) => (
                <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues}/>
              ))}
            </Debug_ResourceGroup>
            <Debug_ResourceGroup>
              {dirty_mana.map((resource) => (
                <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues}/>
              ))}
            </Debug_ResourceGroup>
            <Debug_ResourceGroup>
              {raw_mana.map((resource) => (
                <Debug_Resource key={resource.id} resource={resource} beautifyValues={beautifyValues}/>
              ))}
            </Debug_ResourceGroup>
            </Box>
          </Debug_Box>
        </Box>
      </Box>
    </>
  )
}

