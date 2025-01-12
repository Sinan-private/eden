import {Resource} from "./index.ts";
import {makeAutoObservable} from "mobx";

export type ResourceTrade<K extends string, T extends string> = {
  resource: Resource<K, T>;
} & Partial<Resource<K, T>>;

export class Trade<K extends string, T extends string> {
  public costs: ResourceTrade<K, T>[];
  public gains: ResourceTrade<K, T>[];

  constructor(
    costs: ResourceTrade<K, T>[],
    gains: ResourceTrade<K, T>[],
    public amount: number = 1
  ) {
    this.costs = costs;
    this.gains = gains;
    makeAutoObservable(this);
  }

  /**
   * Calculates the maximum possible amount for the trade based on resource constraints.
   */
  public getMaxPossibleAmount = (): number =>
    getMaxPossibleAmount(this.costs, this.gains, this.amount);

  /**
   * Checks if the trade is partially or fully possible based on the given amount.
   */
  public isTradePossible(): boolean {
    return this.getMaxPossibleAmount() > 0;
  }

  public enforceTrade = ()=> {
    this._executeTrade(this.amount)
  }

  /**
   * Executes the trade for the maximum feasible amount.
   */
  public executeTrade() {
    const maxPossibleAmount = this.getMaxPossibleAmount();

    if (maxPossibleAmount === 0) {
      console.warn("Trade not possible due to constraints");
      return 0;
    }
    this._executeTrade(maxPossibleAmount)
  }

  public tradeIfPossible = () => {
    if (this.isTradePossible()) {
      this.executeTrade()
    }
  }

  private _executeTrade = (amount: number) => {
    /** This does some heavy lifting. The change can be of many different types like
     * {value: 100}, {value: 10, max: 5}, {label: 'Mastered'}
     * Therefore it needs to create the right object to pass to the resource updateBy()
     * Decided to leave it here because it calls a resource update
     */
    const updateResources = (
      change: ResourceTrade<K, T>[],
      calculation: (value: number) => number
    ) => {
      change.forEach(({ resource, ...update }) => {
        const adjustedUpdate = Object.fromEntries(
          Object.entries(update).map(([key, value]) => {
            if (typeof value === 'number') {
              return [key, calculation(value) * amount]; // Adjust numerical values with the multipliers
            }
            return [key, value]; // Leave non-numerical values as-is
          })
        );
        resource.updateBy(adjustedUpdate);
      });
    }
    updateResources(this.costs, (value) => -value)
    updateResources(this.gains, (value) => value)

  }
  /**
   * Evaluates the trade outcome for the maximum feasible amount without applying it.
   * -> This might be outdated after the improvement to allow every change in a trade, e.g. max updates
   */
  public evaluateTrade(): { [key: string]: { before: number; after: number } } {
    const maxPossibleAmount = this.getMaxPossibleAmount();
    const result: { [key: string]: { before: number; after: number } } = {};

    // Evaluate scaled costs
    this.costs.forEach(({ resource, value = 1 }) => {
      result[resource.key] = {
        before: resource.value,
        after: resource.respectConstraints(
          resource.value - value * maxPossibleAmount
        ),
      };
    });

    // Evaluate scaled gains
    this.gains.forEach(({ resource, value = 1 }) => {
      result[resource.key] = result[resource.key] || {
        before: resource.value,
        after: resource.value,
      };
      result[resource.key].after = resource.respectConstraints(
        result[resource.key].after + value * maxPossibleAmount
      );
    });

    return result;
  }
}

const getMaxPossibleAmount = <K extends string, T extends string>(
  costs: ResourceTrade<K, T>[],
  gains: ResourceTrade<K, T>[],
  amount: number,
): number => {

  const maxByCosts = costs.map(({ resource, ...updates}) => {
    const list = Object.entries(updates).map(([key, change]) => {
      switch (key) {
        case 'value':
          // The regular method just checking how often the trade could be executed
          return Math.floor((resource.value - resource.min) / (change as number))
        case 'min':
          // passing a min into costs means the min value will be reduced. The is no limit to this
          return Infinity
        case 'max':
          // The max will reduce the max and only allow it to be bigger or equal to the min
          return Math.floor((resource.max - resource.min) / (change as number))
        default:
          return Infinity
      }
    })
    return Math.min(...list)
  });

  const maxByGains = gains.map(({ resource, ...updates}) => {
    const list = Object.entries(updates).map(([key, change]) => {
      switch (key) {
        case 'value':
          // The gain has a regular check against max
          return Math.floor((resource.max - resource.value) / (change as number))
        case 'min':
          // Providing a min here means the min will be raised. Also to the limit of the max
          return Math.floor((resource.max - resource.min) / (change as number))
        case 'max':
          // The max value can raise infinitely
          return Infinity
        default:
          return Infinity
      }
    })
    return Math.min(...list)
  });
  return Math.min(...maxByCosts, ...maxByGains, amount);
}