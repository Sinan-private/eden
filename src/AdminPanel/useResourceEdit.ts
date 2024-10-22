import {useGame} from "../context/game.context.ts";
import {ChangeEvent, useMemo, useState} from "react";
import {Icon, TradeChange} from "../Resource/types.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {SelectChangeEvent} from "@mui/material/Select";
import {Resource} from "../Resource";
import icons from "../assets/icons/icons.ts";

type GiveOrGain = 'give' | 'gain' | '';

export const useResourceEdit = (resource: Resource<ResourceKeys, ResourceTypes>) => {
  const {
    resources: {
      mergeChangeToState,
    },
    writeInitialResources
  } = useGame();
  const [value, setValue] = useState(resource.value)
  const [label, setLabel] = useState(resource.label)
  const [type, setType] = useState(resource.type);
  const [icon, setIcon] = useState(resource.iconName);
  const [showUsed, setShowUsed] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [open, setOpen] = useState(false);
  const [cost, setCost] = useState(resource.cost);
  const [openAddCost, setOpenAddCost] = useState(false);
  const [costChangeKey, setCostChangeKey] = useState<GiveOrGain>('');

  const onSetCost = (
    changeKey: 'give' | 'gain',
    change: TradeChange<ResourceKeys>
  ) => {
    if (!cost) {
      return
    }
    const newCost = resource.updateCost(changeKey, change)
    setCost(newCost)
  }

  const onAddCost = (
    change: TradeChange<ResourceKeys>
  ) => {
    const newCost = resource.addCost(costChangeKey, change)
    if (newCost) {
      setCost(newCost)
      setOpenAddCost(false)
    }
  }
  // Todo this should all move into the global state because it sucks to pass all the props and callbacks
  const onRemoveCost = (
    changeKey: 'give' | 'gain' | '',
    resourceKey: ResourceKeys
  ) => {
    const newCost = resource.removeCost(changeKey, resourceKey)
    if (newCost) {
      setCost(newCost)
    }
  }

  const handleOpenAddCost = (giveOrGain: GiveOrGain) => {
    if (giveOrGain.length) {
      setOpenAddCost(true);
      setCostChangeKey(giveOrGain);
    }
  };
  const handleCloseAddCost = () => {
    setOpenAddCost(false);
    // setAddGiveOrGain('');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onClickIcon = (clickedIcon: Icon) => {
    setIcon(clickedIcon.name)
    handleClose()
  }

  const onToggleFilter = () => setShowUsed(!showUsed);
  const onToggleCost = () => setShowCost(!showCost);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as ResourceTypes);
  };


  const updateValue = () => {
    const newState = mergeChangeToState({
      ...resource.state,
      value,
      label,
      type,
      cost,
      iconName: icon,
    })
    writeInitialResources(newState)
  }

  const isDisabled = useMemo(() => {
    return !(
      value !== resource.value
      || label !== resource.label
      || type !== resource.type
      || icon !== resource.iconName
      || JSON.stringify(cost) !== JSON.stringify(resource.cost)
    );
  }, [value, label, type, icon, resource, cost])

  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLabel(e.target.value)
  const onSetValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(Number(e.target.value))

  const _icon = icons.find(({name}) => name === icon)?.src || '';

  return {
    value,
    label,
    type,
    showUsed,
    showCost,
    open,
    cost,
    openAddCost,
    costChangeKey,
    icon: _icon,
    onSetCost,
    onAddCost,
    handleClose,
    handleOpen,
    handleCloseAddCost,
    handleTypeChange,
    handleOpenAddCost,
    onClickIcon,
    isDisabled,
    onToggleFilter,
    onToggleCost,
    updateValue,
    onSetLabel,
    onSetValue,
    onRemoveCost,
  }
}
