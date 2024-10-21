import {Stack, TextField, Typography} from "@mui/material";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {ResourceCost, TradeChange, TradeChangePlusIcon} from "../Resource/types.ts";
import {OnSetCost} from "./EditResource.tsx";
import {Resource} from "../Resource";

type CostProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  // cost: ResourceCost<ResourceKeys> | null;
  onSetCost: OnSetCost;
  onOpenAddCost(giveOrGain: 'give' | 'gain'): void;
};

export const Cost = ({resource, onSetCost, onOpenAddCost}: CostProps) => {
  // Nope, not good. The state update needs to be handled in a single place. Meaning here, or rather in the EditResource

  const onOpenGive = () => onOpenAddCost('give');
  const onOpenGain = () => onOpenAddCost('gain');

  const _onSetCost = (type: 'give' | 'gain') => (change: TradeChange<ResourceKeys>) => onSetCost(type, change)
  return (
    <Stack spacing={2}>
    <Stack direction="row" alignItems="center" spacing={4}>
      <Typography>

      Give
      </Typography>
      {resource.cost?.give.map(give => (
        <SingleCost key={give.key} change={give} onSetCost={_onSetCost('give')} />
      ))}
      <button style={{height: 56}} onClick={onOpenGive}>Add</button>

    </Stack>
      <Stack direction="row" alignItems="center" spacing={4}>
        <Typography>

          Gain
        </Typography>
        {resource.cost?.gain.map(gain => (
          <SingleCost key={gain.key} change={gain} onSetCost={_onSetCost('gain')}/>
        ))}
        <button style={{height: 56}} onClick={onOpenGain}>Add</button>

      </Stack>
    </Stack>

  )
}

type SingleCostProps = {
  // resource: Resource<ResourceKeys, ResourceTypes>;
  change: TradeChangePlusIcon<ResourceKeys>;
  onSetCost(change: TradeChange<ResourceKeys>): void;
}

const SingleCost = ({change, onSetCost}: SingleCostProps) => {
  // const [value, setValue] = useState(change.value);
  //
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onSetCost({key: change.key, value});
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
        value={change.value}
        type="number"
        sx={{width: 80}}
        onChange={onChange}
      />
    </Stack>
  )
}
