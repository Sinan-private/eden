import {TradeUpdate} from "../context/types.ts";
import {TradeResourceKeys} from "./types.ts";
type ConversionMethodKeys = Record<TradeResourceKeys, () => TradeUpdate>

export class ResourceConversion implements ConversionMethodKeys {
  constructor() {
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
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 5}],
    gain: [{key: 'well', value: 1}]
  });

  public readonly windmill = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
    gain: [{key: 'windmill', value: 1}]
  });

  public readonly bakery = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 2}],
    gain: [{key: 'bakery', value: 1}]
  });

  public readonly wood_mill = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'wood', value: 5}],
    gain: [{key: 'wood_mill', value: 1}]
  });

  public readonly forrester = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'stone', value: 5}],
    gain: [{key: 'forrester', value: 1}]
  });

  public readonly pasture = (): TradeUpdate => ({
    give: [{key: 'land', value: 1}, {key: 'gold', value: 20}, {key: 'bricks', value: 3}],
    gain: [{key: 'pasture', value: 1}]
  });

  public readonly bread = (): TradeUpdate => ({
    give: [{key: 'flour', value: 1}, {key: 'water', value: 2}],
    gain: [{key: 'bread', value: 1}],
  });

  public readonly flour = (): TradeUpdate => ({
    give: [{key: 'corn', value: 2}],
    gain: [{key: 'flour', value: 1}],
  });

  public readonly meat = (): TradeUpdate => ({
    give: [{key: 'corn', value: 5}, {key: 'water', value: 5}],
    gain: [{key: 'meat', value: 1}],
  });

  public readonly milk = (): TradeUpdate => ({
    give: [{key: 'corn', value: 5}],
    gain: [{key: 'milk', value: 1}],
  });

  public readonly wool = (): TradeUpdate => ({
    give: [{key: 'corn', value: 5}],
    gain: [{key: 'wool', value: 1}],
  });

  public readonly planks = (): TradeUpdate => ({
    give: [{key: 'wood', value: 2}],
    gain: [{key: 'planks', value: 1}],
  });

  public readonly bricks = (): TradeUpdate => ({
    give: [{key: 'stone', value: 4}],
    gain: [{key: 'bricks', value: 1}],
  });
}
