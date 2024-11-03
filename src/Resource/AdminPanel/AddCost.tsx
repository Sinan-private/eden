import {SyntheticEvent, useMemo, useState} from "react";
import {Autocomplete, IconButton, Stack, SxProps, TextField} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import {TradeChange} from "../genericTypes.ts";
import {ResourceKeys} from "../specificTypes.ts";
import {useAdmin} from "../Admin/admin.context.ts";

type ResourceForCostProps = {
  onAddCost(change: TradeChange<ResourceKeys>): void;
  cost: TradeChange<ResourceKeys>[];
  sx?: SxProps;
}

export const AddCost = ({onAddCost, cost, sx}: ResourceForCostProps) => {
  const {getByType} = useAdmin().resources;
  const [selectedResource, setSelectedResource] = useState<{ key: ResourceKeys; label: string } | null>(null);
  const [selectAmount, setSelectAmount] = useState(1);
  const resourcesForSelect = useMemo(() => {
    const toRemove = cost.map(({key}) => key);
    return getByType()
      .filter(resource => !toRemove.includes(resource.key))
      .map(({label, key}) => ({key, label}))
  }, [cost, getByType])
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
      key: selectedResource.key,
      value: selectAmount
    };
    onAddCost(update)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={sx}>
      <Autocomplete
        disablePortal
        options={resourcesForSelect}
        sx={sx}
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
      <IconButton onClick={onSubmit} disabled={!selectedResource} color="success">
        <CheckIcon />
      </IconButton>
    </Stack>
  )
}
