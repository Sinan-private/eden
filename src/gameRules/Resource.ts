import {ResourceSingle} from "../Resource/ResourceSingle.ts";
import {ResourceKeys, ResourceTypes, TradeResourceKeys} from "./types.ts";
import {ResourceUpdateProps} from "../Resource/types.ts";
import {TradeUpdate} from "../context/types.ts";
import {ResourceConversion} from "./ResourceConversion.ts";

export class Resource extends ResourceSingle<ResourceKeys, ResourceTypes>{
  public readonly trade: TradeUpdate;
  public readonly has_trade: boolean;
  constructor(raw_resource: ResourceUpdateProps<ResourceKeys, ResourceTypes>) {
    super(raw_resource);
    const trade = new ResourceConversion()[raw_resource.key as TradeResourceKeys]
    this.trade = trade ? trade() : {} as TradeUpdate;
    this.has_trade = !!trade;
  }
}
