import {TradeUpdate as FinalTradeUpdate} from "../context/types.ts";
import {ResourceKeys, ResourceTypes, TradeResourceKeys} from "./types.ts";
import {ResourceUpdateProps} from "../Resource";
import {Resource} from "./Resource.ts";
type ConversionMethodKeys = Record<TradeResourceKeys, () => TradeUpdate>

export type Update = ResourceUpdateProps<ResourceKeys, ResourceTypes>;
export type TradeUpdate = {
  give: Update[];
  gain: Update[];
  multiplier?: number
}


export class ResourceConversion implements ConversionMethodKeys {
  public readonly costs: Record<TradeResourceKeys, TradeUpdate>;

  constructor() {
    this.costs = {
      land: {
        give: [{key: 'gold', value: 10}],
        gain: [{key: 'land', value: 1}]
      },
      field: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 10}],
        gain: [{key: 'field', value: 1}]
      },
      well: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 5}],
        gain: [{key: 'well', value: 1}]
      },
      windmill: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
        gain: [{key: 'windmill', value: 1}]
      },
      bakery: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 2}],
        gain: [{key: 'bakery', value: 1}]
      },
      wood_mill: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
        gain: [{key: 'windmill', value: 1}]
      },
      forrester: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'stone', value: 5}],
        gain: [{key: 'forrester', value: 1}]
      },
      pasture: {
        give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
        gain: [{key: 'pasture', value: 1}]
      },
      bread: {
        give: [{key: 'flour', value: 1}, {key: 'water', value: 2}],
        gain: [{key: 'bread', value: 1}],
      },
      flour: {
        give: [{key: 'corn', value: 2}],
        gain: [{key: 'flour', value: 1}],
      },
      meat: {
        give: [{key: 'corn', value: 5}, {key: 'water', value: 5}],
        gain: [{key: 'meat', value: 1}],
      },
      milk: {
        give: [{key: 'corn', value: 5}],
        gain: [{key: 'milk', value: 1}],
      },
      wool: {
        give: [{key: 'corn', value: 5}],
        gain: [{key: 'wool', value: 1}],
      },
      planks: {
        give: [{key: 'wood', value: 2}],
        gain: [{key: 'planks', value: 1}],
      },
      bricks: {
        give: [{key: 'stone', value: 4}],
        gain: [{key: 'bricks', value: 1}],
      }
    }
  }

  private readonly __toResource = (trade: TradeUpdate): FinalTradeUpdate => {
    if (!Object.entries(trade).length) {
      return {} as FinalTradeUpdate;
    }
    return {
      give: trade.give.map(change => new Resource(change)),
      gain: trade.gain.map(change => new Resource(change)),
      multiplier: trade.multiplier,
    }
  }

  public readonly land = (): FinalTradeUpdate => this.__toResource(this.costs.land)
  public readonly field = (): FinalTradeUpdate => this.__toResource(this.costs.field)
  public readonly well = (): FinalTradeUpdate => this.__toResource(this.costs.well)
  public readonly windmill = (): FinalTradeUpdate => this.__toResource(this.costs.windmill)
  public readonly bakery = (): FinalTradeUpdate => this.__toResource(this.costs.bakery)
  public readonly wood_mill = (): FinalTradeUpdate => this.__toResource(this.costs.wood_mill)
  public readonly forrester = (): FinalTradeUpdate => this.__toResource(this.costs.forrester)
  public readonly pasture = (): FinalTradeUpdate => this.__toResource(this.costs.pasture)
  public readonly bread = (): FinalTradeUpdate => this.__toResource(this.costs.bread)
  public readonly flour = (): FinalTradeUpdate => this.__toResource(this.costs.flour)
  public readonly meat = (): FinalTradeUpdate => this.__toResource(this.costs.meat)
  public readonly milk = (): FinalTradeUpdate => this.__toResource(this.costs.milk)
  public readonly wool = (): FinalTradeUpdate => this.__toResource(this.costs.wool)
  public readonly planks = (): FinalTradeUpdate => this.__toResource(this.costs.planks)
  public readonly bricks = (): FinalTradeUpdate => this.__toResource(this.costs.bricks)

}
