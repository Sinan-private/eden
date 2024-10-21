import {useGame} from "../context/game.context.ts";
import {ChangeEvent, useMemo, useState} from "react";
import {Icon, TradeChange} from "../Resource/types.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {ResourceBase} from "../Resource";
import {SelectChangeEvent} from "@mui/material/Select";
import {Resource} from "../Resource/Resource.ts";

type GiveOrGain = 'give' | 'gain' | '';

export const useResourceEdit = (resource: Resource<ResourceKeys, ResourceTypes>) => {
  const {
    resources: {
      mergeChangeToState,
      icons,
    },
    writeInitialResources
  } = useGame();
  const [value, setValue] = useState(resource.value)
  const [label, setLabel] = useState(resource.label)
  const [type, setType] = useState(resource.type);
  const [icon, setIcon] = useState(resource.icon);
  const [showUsed, setShowUsed] = useState(false);
  const [showCost, setShowCost] = useState(true);
  const [open, setOpen] = useState(false);
  const [cost, setCost] = useState(resource.__cost);
  const [openAddCost, setOpenAddCost] = useState(false);
  const [addGiveOrGain, setAddGiveOrGain] = useState<GiveOrGain>('');

  const onSetCost = (
    changeType: 'give' | 'gain', // give or gain
    change: TradeChange<ResourceKeys>
  ) => {
    if (!cost) {
      return
    }
    const newCost = resource.updateCost(changeType, change)
    setCost(newCost)
  }

  const onAddCost = (
    // changeType: 'give' | 'gain', // give or gain
    change: TradeChange<ResourceKeys>
  ) => {
    if (!cost || !addGiveOrGain.length) {
      return
    }
    const newCost = {
      ...cost,
      [addGiveOrGain]: cost[addGiveOrGain as ('give' | 'gain')].concat(new ResourceBase(change))
    }
    console.log(newCost)
    setCost(newCost)
  }

  const handleOpenAddCost = (giveOrGain: GiveOrGain) => {
    if (giveOrGain.length) {
      setOpenAddCost(true);
      setAddGiveOrGain(giveOrGain);
    }
  };
  const handleCloseAddCost = () => {
    setOpenAddCost(false);
    // setAddGiveOrGain('');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onClickIcon = (clickedIcon: Icon) => {
    setIcon(clickedIcon.src)
    handleClose()
  }

  const onToggleFilter = () => setShowUsed(!showUsed);
  const onToggleCost = () => setShowCost(!showCost);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as ResourceTypes);
  };


  const updateValue = () => {
    const _icon = icons.getBySrc(icon).name;
    const newState = mergeChangeToState({
      ...resource.state,
      value,
      label,
      type,
      cost,
      iconName: _icon
    })
    writeInitialResources(newState)
  }

  const isDisabled = useMemo(() => {
    return !(
      value !== resource.value
      || label !== resource.label
      || type !== resource.type
      || icon !== resource.icon
      || JSON.stringify(cost) !== JSON.stringify(resource.__cost)
    );
  }, [value, label, type, icon, resource, cost])

  const onSetLabel = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLabel(e.target.value)
  const onSetValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(Number(e.target.value))

  const costForBla = cost && addGiveOrGain.length ? cost[addGiveOrGain as 'give' | 'gain'] : []


  return {
    value,
    label,
    type,
    showUsed,
    showCost,
    open,
    cost,
    openAddCost,
    addGiveOrGain,
    icon,
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
    costForBla,
  }
}