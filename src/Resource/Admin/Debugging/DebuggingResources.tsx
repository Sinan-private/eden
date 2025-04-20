import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {game} from "@/test_eden/Classes/Game";
import {Debug_Resource, Debug_ResourceGroup} from "@/test_eden/debug/custom/Debug_Resource.tsx";
import {Box} from "@/components/ui";

export const DebuggingResources = () => {
  const {
    showDebugPanelBeautifiedValues,
  } = AdminController.getInstance();
  const {resources} = game()
  const byType = resources.getResourcesByType()

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {byType.map(({type, resources}) => (
        <Box key={type}>
          <Debug_ResourceGroup>
            <p>{type}</p>
            {resources.map((resource) => (
              <Debug_Resource key={resource.id} resource={resource} beautifyValues={showDebugPanelBeautifiedValues}/>
            ))}
          </Debug_ResourceGroup>
        </Box>
      ))}
    </div>
  )
}