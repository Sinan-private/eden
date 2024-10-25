import {useState} from "react";
import {IconButton, Stack, TextField, Typography} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {ResourceCostUpdate, TradeChange} from "../Resource/genericTypes.ts";
import {OnSetCost} from "./EditResource.tsx";
import {ResourceKeys} from "../Resource/specificTypes.ts";
import {useAdmin} from "../Resource/Admin/admin.context.ts";
import {capitalizeFirstLetter} from "../Resource/helpers/captializeFirstLetter.ts";
import {AddCost} from "./Add/AddCost.tsx";

type CostProps = {
  cost: ResourceCostUpdate<ResourceKeys> | null;
  onSetCost: OnSetCost;
  onOpenAddCost(giveOrGain: 'give' | 'gain'): void;
  onRemoveCost(changeKey: 'give' | 'gain', resourceKey: ResourceKeys): void;
  onAddCost(changeKey: 'give' | 'gain' | '', change: TradeChange<ResourceKeys>): void
};

export const Cost = (props: CostProps) => {
  return (
    <Stack spacing={10} direction="row" pl={8}>
      <CostChange {...props} changeKey="give"/>
      <CostChange {...props} changeKey="gain"/>
    </Stack>

  )
}

type CostChangeProps = {
  changeKey: 'give' | 'gain';
} & CostProps

const CostChange = (
  {
    cost,
    onSetCost,
    changeKey,
    onRemoveCost,
    onAddCost,
  }: CostChangeProps
) => {
  const [showAddCost, setShowAddCost] = useState(false);
  const _onSetCost = (change: TradeChange<ResourceKeys>) => onSetCost(changeKey, change);
  const _onAddCost = (change: TradeChange<ResourceKeys>) => {
    setShowAddCost(false);
    onAddCost(changeKey, change);
  };
  const change = cost?.give ? cost[changeKey] : [];

  return (
    <Stack direction="column" spacing={2}>
      <Typography>
        {capitalizeFirstLetter(changeKey)}
      </Typography>
      {change.map(singleChange => (
        <SingleCost
          key={singleChange.key}
          change={singleChange}
          onSetCost={_onSetCost}
          onRemoveCost={() => onRemoveCost(changeKey, singleChange.key)}
        />
      ))}
      {
        showAddCost
          ? <AddCost onAddCost={_onAddCost} cost={change} sx={{width: 280}}/>
          : <button style={{height: 56}} onClick={() => setShowAddCost(true)}>Add</button>
      }


    </Stack>
  )
}

type SingleCostProps = {
  change: TradeChange<ResourceKeys>;
  onSetCost(change: TradeChange<ResourceKeys>): void;
  onRemoveCost(): void;
}

const SingleCost = ({change, onSetCost, onRemoveCost}: SingleCostProps) => {
  const {get} = useAdmin().resources;
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onSetCost({key: change.key, value});
  }
  // const icon = icons.getByKey(change.key)
  const icon = get(change.key)?.icon
  console.log(icon)

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <img
        src={icon}
        alt={change.key}
        width={32}
        height={32}
      />
      <TextField
        value={change.value}
        type="number"
        sx={{width: 80}}
        onChange={onChange}
        size="small"
      />
      <IconButton
        onClick={onRemoveCost}
        size="small"
      >
        <DeleteOutlineIcon fontSize="inherit"/>
      </IconButton>
    </Stack>
  )
}
