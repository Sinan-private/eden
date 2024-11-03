import {useGame} from "../../../context/game.context.ts";
import {SyntheticEvent, useMemo, useState} from "react";
import {ResourceKeys} from "../../specificTypes.ts";
import {Autocomplete, Stack, TextField, Typography} from "@mui/material";

export const Dependencies = () => {
  const {resources} = useGame();
  const [selectedResource, setSelectedResource] = useState<{ key: ResourceKeys; label: string } | null>(null);
  const resourcesForSelect = resources.state.map(({key}) => ({key, label: key}));
  const onChange = (_a: SyntheticEvent<Element, Event>, change: { key: string; label: string } | null) => {
    if (!change) {
      setSelectedResource(null)
      return;
    }
    const {key, label} = change;
    setSelectedResource({key: key as ResourceKeys, label});
  }
  const toShow = useMemo(() => {
    if (!selectedResource) {
      return [];
    }
    return resources.getResourcesWithCost(selectedResource.key).map(({key}) => key);
  }, [resources, selectedResource]);

  return (
    <>
      <Autocomplete
        disablePortal
        options={resourcesForSelect}
        renderInput={(params) => <TextField {...params} label="Resource"/>}
        onChange={onChange}
        onReset={() => setSelectedResource(null)}
      />
      <Typography>Dependencies</Typography>
      <Typography>See where a resource is being used</Typography>
      {toShow.map(r => {
        const res = resources.get(r)
        return (
          <Stack key={res.key} width={100} alignItems="center" spacing={2} direction="row" mb={2}>
            <img src={res.icon} width={32} height={32}/>
            <Typography>{res.label}</Typography>
          </Stack>
        )
      })}
    </>
  )
}