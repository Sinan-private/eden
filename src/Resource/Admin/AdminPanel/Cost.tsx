import {useState} from "react";
import {IconButton, Stack, TextField, Typography} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {ResourceCostUpdate, TradeChange} from "../../genericTypes.ts";
import {OnSetCost} from "./EditResource";
import {ResourceKeys} from "../../specificTypes.ts";
import {useAdmin} from "../admin.context.ts";
import {capitalizeFirstLetter} from "../../helpers/captializeFirstLetter.ts";
import {AddCost} from "./EditResource/AddCost.tsx";
import {themeColors} from "../../assets/colors.ts";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Close from "@mui/icons-material/Close";

type CostProps = {
  cost: ResourceCostUpdate<ResourceKeys> | null;
  onSetCost: OnSetCost;
  onRemoveCost(changeKey: 'give' | 'gain', resourceKey: ResourceKeys): void;
  onAddCost(changeKey: 'give' | 'gain' | '', change: TradeChange<ResourceKeys>): void
};

export const Cost = (props: CostProps) => {
  return (
    <Stack spacing={2} direction="row" pl={8}>
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
    <Stack direction="column" spacing={1} sx={{minWidth: 300}}>
      <Typography align="left" sx={{color: themeColors.color5}}>
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
          ? (
            <Box position="relative">
              <AddCost onAddCost={_onAddCost} cost={change} sx={{width: 280}}/>
              <IconButton onClick={() => setShowAddCost(false)} sx={{position: 'absolute', top: -25, left: -25, color: "text.secondary"}} size="small">
                <Close fontSize="inherit" />
              </IconButton>
            </Box>
          )
          : <StyledButton onClick={() => setShowAddCost(true)}>Add</StyledButton>
      }
    </Stack>
  )
}

const StyledButton = styled('button')`
    background: transparent;
    border: 1px solid ${themeColors.color5};
    color: ${themeColors.color5};
    border-radius: 50px;
    text-transform: uppercase;
    font-size: 14px;
    width: 80px;
    text-align: center;
    margin-left: 40px!important;
    margin-bottom: 20px!important;
`;

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
  // This one is a nasty little bitch. The already annoying situation that I need to get cost icons this way
  // really brakes the chain here. A newly created resource can not provide this yet. -> See getResource.ts
  const icon = get(change.key)?.icon

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
