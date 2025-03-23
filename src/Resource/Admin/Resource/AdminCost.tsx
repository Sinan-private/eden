import {useState, ChangeEvent} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {IconButton, Stack, TextField, Typography} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Box from "@mui/material/Box";
import Close from "@mui/icons-material/Close";
import {ResourceClass, TradeChange} from "../../ResourceHandler/specificTypes.ts";
import {themeColors} from "../../assets/colors.ts";
import {useAdmin} from "../../context/admin.context.ts";
import {AddCost} from "./AddCost.tsx";
import {capitalizeFirstLetter} from "../../helpers/capitalizeFirstLetter.ts";

type AdminCostProps = {
  resource: ResourceClass;
};

export const AdminCost = ({resource}: AdminCostProps) => {
  return (
    <Stack spacing={2} direction="row" pl={8}>
      <CostChange resource={resource} changeKey="give"/>
      <CostChange resource={resource} changeKey="gain"/>
    </Stack>
  )
}

type CostChangeProps = {
  changeKey: 'give' | 'gain';
  resource: ResourceClass;
}

const CostChange = observer((
  {
    resource,
    changeKey,
  }: CostChangeProps
) => {
  const {
    cost
  } = resource
  const [showAddCost, setShowAddCost] = useState(false);
  const _onAddCost = (change: TradeChange) => {
    setShowAddCost(false);
    resource.addCost(changeKey, change)
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
          resource={resource}
          changeKey={changeKey}
          change={singleChange}
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
})

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
  change: TradeChange;
  changeKey: 'give' | 'gain';
  resource: ResourceClass;
}

const SingleCost = ({change, changeKey, resource}: SingleCostProps) => {
  const {getByKey} = useAdmin().resources;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    resource.updateCost(changeKey, {key: change.key, value})
  }

  const onRemoveCost = () => {
    resource.removeCost(changeKey, change.key);
  }
  // This one is a nasty little bitch. The already annoying situation that I need to get cost icons this way
  // really brakes the chain here. A newly created resource can not provide this yet. -> See getResource.ts
  const icon = getByKey(change.key)?.icon

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
