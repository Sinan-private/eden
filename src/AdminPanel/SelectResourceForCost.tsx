import {Autocomplete, Stack, TextField} from "@mui/material";
import {useGame} from "../context/game.context.ts";
import {SyntheticEvent, useMemo, useState} from "react";
import {ResourceKeys} from "../gameRules/types.ts";
import {TradeChange} from "../Resource/types.ts";

// Todo the resources that are already part of the cost should be excluded from the selection

type ResourceForCostProps = {
  onAddCost(change: TradeChange<ResourceKeys>): void;
  cost: TradeChange<ResourceKeys>[];
}

export const SelectResourceForCost = ({onAddCost, cost}: ResourceForCostProps) => {
  console.log(cost)
  const {getType} = useGame().resources;
  const [selectedResource, setSelectedResource] = useState<{ key: ResourceKeys; label: string } | null>(null);
  const [selectAmount, setSelectAmount] = useState(1);
  const resourcesForSelect = useMemo(() => {
    const toRemove = cost.map(({key}) => key);
    return getType()
      .filter(resource => !toRemove.includes(resource.key))
      .map(({label, key}) => ({key, label}))
  }, [getType])
  const onChange = (_a: SyntheticEvent<Element, Event>, change: { key: string; label: string } | null) => {
    if (!change) {
      setSelectedResource(null)
      return;
    }
    const {key, label} = change;
    setSelectedResource({key: key as ResourceKeys, label});
  }
  const onSubmit = () => {
    if (!selectedResource) {
      return;
    }
    const update = {
      ...selectedResource,
      value: selectAmount
    };
    onAddCost(update)
    console.log(update)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Autocomplete
        disablePortal
        options={resourcesForSelect}
        sx={{width: 300}}
        renderInput={(params) => <TextField {...params} label="Resource"/>}
        onChange={onChange}
        onReset={() => setSelectedResource(null)}
      />
      <TextField
        type="number"
        onChange={(e) => setSelectAmount(Number(e.target.value))}
        value={selectAmount}
        disabled={!selectedResource}
      />
      <button onClick={onSubmit} disabled={!selectedResource}>Submit</button>
    </Stack>
  )
}
