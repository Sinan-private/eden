import {Box, Container} from "@/GameController/components/ui/Box.tsx";
import {Debug_Resource, Debug_ResourceGroup} from "@/Game/debug/custom/Debug_Resource.tsx";
import {game} from "@/Game/Classes/Game";

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