import {Stack, TextField, Typography} from "@mui/material";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {Resource} from "../Resource/Resource.ts";
import {TradeChange} from "../Resource/types.ts";
import {useState} from "react";
import {OnSetCost} from "./EditResource.tsx";

type CostProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  onSetCost: OnSetCost;
};

export const Cost = ({resource, onSetCost}: CostProps) => {
  // Nope, not good. The state update needs to be handled in a single place. Meaning here, or rather in the EditResource
  return (
    <Stack spacing={2}>
    <Stack direction="row" alignItems="center" spacing={4}>
      <Typography>

      Give
      </Typography>
      {resource.cost?.give.map(give => (
        <SingleCost resource={resource} change={give} />

      ))}

    </Stack>
      <Stack direction="row" alignItems="center" spacing={4}>
        <Typography>

          Gain
        </Typography>
        {resource.cost?.gain.map(gain => (
          <SingleCost change={gain} onSetCost={(change: TradeChange<ResourceKeys>) => onSetCost(resource.key, change)} />
        ))}
      </Stack>
    </Stack>

  )
}

type SingleCostProps = {
  // resource: Resource<ResourceKeys, ResourceTypes>;
  change: TradeChange<ResourceKeys>;
  onSetCost(change: TradeChange<ResourceKeys>): void;
}

const SingleCost = ({change, onSetCost}: SingleCostProps) => {
  const [value, setValue] = useState(change.value);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

  }

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <img
        src={change.icon}
        alt={change.key}
        width={32}
        height={32}
      />
      <TextField
        value={value}
        type="number"
        sx={{width: 80}}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </Stack>
  )
}