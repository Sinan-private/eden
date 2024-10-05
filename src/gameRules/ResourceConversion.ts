import {State, TradeUpdate} from "../context/types.ts";
import {ResourceKeys} from "./types.ts";
import {get} from "../context/helper/getResource.ts";

export class ResourceConversion implements Partial<Record<ResourceKeys, () => TradeUpdate>>{
  constructor(private readonly state: State[]) {
  }

  public readonly land = (): TradeUpdate => ({
    give: [{key: 'gold', value: 10}],
    gain: [{key: 'land', value: 1}]
  })

  public readonly field = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 10}],
    gain: [{key: 'field', value: 1}]
  });

  public readonly well = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}],
    gain: [{key: 'well', value: 1}]
  });

  public readonly windmill = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}],
    gain: [{key: 'windmill', value: 1}]
  });

  public readonly bakery = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}],
    gain: [{key: 'bakery', value: 1}]
  });

  public readonly wood_mill = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}],
    gain: [{key: 'wood_mill', value: 1}]
  });

  public readonly forrester = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}],
    gain: [{key: 'forrester', value: 1}]
  });

  public readonly bread = (): TradeUpdate => ({
    give: [{key: 'flour', value: 1}, {key: 'water', value: 2}],
    gain: [{key: 'bread', value: 1}],
    multiplier: this.__get('bakery').value
  });

  public readonly flour = (): TradeUpdate => ({
    give: [{key: 'corn', value: 2}],
    gain: [{key: 'flour', value: 1}],
    multiplier: this.__get('windmill').value
  });

  private readonly __get = (key: ResourceKeys) => get(key, this.state)
}