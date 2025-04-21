import {Box, Container} from "@/Game/components/ui/Box.tsx";
import {Debug_Resource, Debug_ResourceGroup} from "@/test_eden/debug/custom/Debug_Resource.tsx";
import {game} from "@/test_eden/Classes/Game";

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