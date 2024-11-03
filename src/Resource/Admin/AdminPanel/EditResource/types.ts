import {SxProps} from "@mui/material";
import {ResourceState, TradeChange} from "../../../genericTypes.ts";
import {ResourceKeys, ResourceTypes} from "../../../specificTypes.ts";

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