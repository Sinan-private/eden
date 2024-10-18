import {Stack, TextField, Typography} from "@mui/material";
import {ResourceBase} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";

type CostProps = {
  resource: ResourceBase<ResourceKeys, ResourceTypes>;
};

export const Cost = ({resource}: CostProps) => {
  console.log(resource)
  return (
    <Stack spacing={2}>
    <Stack direction="row" alignItems="center" spacing={4}>
      <Typography>

      Give
      </Typography>
      <Stack spacing={1} direction="row" alignItems="center">
        <img
          src={'icon'}
          alt={''}
          width={32}
          height={32}
        />
        <TextField value="100" type="number" sx={{width: 80}} />
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <img
          src={'icon'}
          alt={''}
          width={32}
          height={32}
        />
        <TextField value="100" type="number" sx={{width: 80}} />
      </Stack>
    </Stack>
      <Stack direction="row" alignItems="center" spacing={4}>
        <Typography>

          Gain
        </Typography>
        <Stack spacing={1} direction="row" alignItems="center">
          <img
            src={'icon'}
            alt={''}
            width={32}
            height={32}
          />
          <TextField value="100" type="number" sx={{width: 80}} />
        </Stack>
      </Stack>
    </Stack>

  )
}