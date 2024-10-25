import {IconButton, Stack, Typography} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import {useGame} from "../context/game.context.ts";
import {resourceTypes} from "../Resource/generated/resourceTypes.ts";
import {AddType} from "./AddType.tsx";
import {ResourceTypes} from "../Resource/specificTypes.ts";
import {useAdmin} from "../Resource/Admin/admin.context.ts";

export const HandleTypes = () => {
  const {resources} = useGame();
  const {write__removeType} = useAdmin();
  const usedTypes = resources.getByType().map(({type}) => type);

  return (
    <>
      HandleTypes
      <Stack direction="column" alignItems="flex-start" ml={4}>
        {resourceTypes.map((resourceType: ResourceTypes) => (
          <Stack key={resourceType} direction="row" alignItems="center">
            <Typography key={resourceType} sx={{width: 200}}>
              {resourceType}
            </Typography>
            <IconButton
              onClick={() => write__removeType(resourceType)}
              size="small"
              disabled={usedTypes.includes(resourceType)}
            >
              <CancelIcon />
            </IconButton>
          </Stack>
        ))}
        <AddType />
      </Stack>
    </>
  )
}
