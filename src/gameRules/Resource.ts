import {ResourceBase, ResourceUpdateProps} from "../Resource";
import {TradeUpdate} from "../context/types.ts";
import {ResourceConversion} from "./ResourceConversion.ts";
import {icons} from "./icons.ts";

export class Resource<K extends string, T extends string> extends ResourceBase<K, T>{
  public readonly trade: TradeUpdate;
  public readonly has_trade: boolean;
  public readonly icon: string;
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
    // This is ignored because of the annoying issue that I can only make the class so flexible. At some point I get a mismatch of the generic state vs. the one I want to use for my auto-fill. So I decided to ignore the issue on this level
    // @ts-ignore
    const trade = new ResourceConversion()[raw_resource.key]
    this.trade = trade ? trade() : {} as TradeUpdate;
    this.has_trade = !!trade;
    // @ts-ignore
    this.icon = icons[raw_resource.key]
  }
}
