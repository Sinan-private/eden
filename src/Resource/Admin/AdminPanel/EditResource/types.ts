import {SxProps} from "@mui/material";
import {Icon, ResourceCostUpdate, TradeChange} from "../../../genericTypes.ts";
import {ResourceKeys, ResourceTypes} from "../../../specificTypes.ts";
import {useResourceClone} from "../../../useResourceClone.ts";
import {ChangeEvent} from "react";
import {EditAmountProps} from "./EditAmount.tsx";
import {Resource} from "../../../../Version 3/Resource/Single";

export type EditResourceProps = {
  resource?: Resource<ResourceKeys, ResourceTypes>;
  onSubmit?(): void;
  onClose?(): void;
  enableKeyEdit?: boolean;
  sx?: SxProps;
};
export type OnSetCost = (
  changeType: 'give' | 'gain',
  change: TradeChange<ResourceKeys>
) => void

type ResourceCloneProps<K extends string, T extends string> = Pick<
  ReturnType<typeof useResourceClone<K, T>>,
  'min'
  | 'max'
  | 'value'
  | 'label'
  | 'type'
  | 'cost'
  | 'revealedAt'
  | 'icon'
  | 'onSetCost'
  | 'onAddCost'
  | 'onRemoveCost'
  | 'onSetRevealedAt'
  | 'onAddRevealedAt'
  | 'onRemoveRevealedAt'
  | 'handleTypeChange'
>

export type EditResourceViewProps = {
  id: string;
  _key: ResourceKeys;
  openIconPicker: boolean;
  filterUsed: boolean;
  handleCloseIconPicker(): void;
  handleOpenIconPicker(): void;
  onToggleFilter(): void;
  onSelectIcon(clickedIcon: Icon): void;
  onSetLabel(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onSetKey(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  keyAlreadyExists: boolean;
  onSubmitChanges(): void;
  saveDisabled: boolean;
  onDeleteCost(): void;
  onDeleteRevealedAt(): void;
  onSetCost(cost: ResourceCostUpdate<ResourceKeys>): void;
  onAddCost(cost: ResourceCostUpdate<ResourceKeys>): void;
  onRemoveCost(changeKey: 'give' | 'gain' | '', resourceKey: ResourceKeys): void;
  onSetRevealedAt(cost: ResourceCostUpdate<ResourceKeys>): void;
  onAddRevealedAt(cost: ResourceCostUpdate<ResourceKeys>): void;
  onRemoveRevealedAt: any;
  handleTypeChange: any;
} & EditAmountProps & EditResourceProps & Resource<ResourceKeys, ResourceTypes>;
