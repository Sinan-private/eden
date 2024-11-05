import {SxProps} from "@mui/material";
import {Icon, ResourceState, TradeChange} from "../../../genericTypes.ts";
import {ResourceKeys, ResourceTypes} from "../../../specificTypes.ts";
import {useResourceClone} from "../../../useResourceClone.ts";
import {ChangeEvent} from "react";
import {EditAmountProps} from "./EditAmount.tsx";

export type EditResourceProps = {
  resource?: Partial<ResourceState<ResourceKeys, ResourceTypes>>;
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
} & EditAmountProps & ResourceCloneProps<ResourceKeys, ResourceTypes> & EditResourceProps;

export type KeyInputProps = {
  value: ResourceKeys;
  onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  keyAlreadyExists: boolean;
  enableKeyEdit?: boolean;
}
