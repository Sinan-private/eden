import {game} from "@/Game";
import {Box} from "@/GameController/components/ui/Box.tsx";
import {Container} from "@/Game/debug/custom/styles.tsx";
import {Debug_Resource, Debug_ResourceGroup} from "@/GameController/Resource/Admin/Debugging/Debug_Resource.tsx";

export const Debug_Earth = () => {
  const {resources} = game();
  const influence = resources.getByKey("human_influence");
  const pollution = resources.getByKey("earth_pollution");
  const virtue = resources.getByKey("human_virtue");

  return (
    <Container>
      <Box>
        <Debug_ResourceGroup>
          <Debug_Resource resource={influence} />
          <Debug_Resource resource={pollution} />
          <Debug_Resource resource={virtue} />
        </Debug_ResourceGroup>
      </Box>
    </Container>
  )
}