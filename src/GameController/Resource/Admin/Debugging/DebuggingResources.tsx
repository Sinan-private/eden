import {game} from "@/Game";
import {Debug_Resource, Debug_ResourceGroup} from "@/GameController/Resource/Admin/Debugging/Debug_Resource.tsx";
import {Box} from "@/GameController/components/ui";

export const DebuggingResources = () => {
  const {resources} = game()
  const byType = resources.getResourcesByType()

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {byType.map(({type, resources}) => (
        <Box key={type}>
          <Debug_ResourceGroup>
            <p>{type}</p>
            {resources.map((resource) => (
              <Debug_Resource key={resource.id} resource={resource} />
            ))}
          </Debug_ResourceGroup>
        </Box>
      ))}
    </div>
  )
}
