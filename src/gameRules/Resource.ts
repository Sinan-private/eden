import {ResourceBase, ResourceUpdateProps} from "../Resource";
import {TradeUpdate as FinalTradeUpdate, TradeUpdate} from "../context/types.ts";
import {ResourceConversion} from "./ResourceConversion.ts";
import {icons} from "./icons.ts";

export class Resource<K extends string, T extends string> extends ResourceBase<K, T>{
  public readonly trade: TradeUpdate;
  public readonly has_trade: boolean;
  public readonly icon: string;
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
    const conversion = new ResourceConversion();
    // This is ignored because of the annoying issue that I can only make the class so flexible. At some point I get a mismatch of the generic state vs. the one I want to use for my auto-fill. So I decided to ignore the issue on this level
    // @ts-ignore
    const trade = conversion.costs[raw_resource.key]
    // console.log(trade)
    this.trade = trade ? this.__toResource(trade) : {} as TradeUpdate;
    this.has_trade = !!trade;
    this.icon = this.__getIcon(raw_resource)
  }
  private readonly __toResource = (trade: TradeUpdate): FinalTradeUpdate => {
    if (!Object.entries(trade).length) {
      return {} as FinalTradeUpdate;
    }
    return {
      give: trade.give.map(change => ({
        ...change,
    // @ts-ignore
        icon: this.__getIcon(change)
        })),
      gain: trade.gain.map(change => ({
      ...change,
    // @ts-ignore
        icon: this.__getIcon(change)
      })),
      multiplier: trade.multiplier,
    }
  }
    // @ts-ignore
  private readonly __getIcon = (raw_resource: ResourceUpdateProps<K, T>) => icons[raw_resource.key]
}
