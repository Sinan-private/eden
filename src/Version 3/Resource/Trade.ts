import {Resource} from "./Single";
import {makeAutoObservable} from "mobx";

export type ResourceTrade<K extends string, T extends string> = {
  resource: Resource<K, T>;
  amount: number;
};

export class Trade<K extends string, T extends string> {
  public costs: ResourceTrade<K, T>[];
  public gains: ResourceTrade<K, T>[];
  public amount: number;

  constructor(
    costs: ResourceTrade<K, T>[],
    gains: ResourceTrade<K, T>[],
    amount: number = 1
  ) {
    this.costs = costs;
    this.gains = gains;
    this.amount = amount;
    makeAutoObservable(this);
  }

  /**
   * Calculates the maximum possible amount for the trade based on resource constraints.
   */
  public getMaxPossibleAmount(): number {
    const maxByCosts = this.costs.map(({ resource, amount }) =>
      Math.floor((resource.value - resource.min) / amount)
    );

    const maxByGains = this.gains.map(({ resource, amount }) =>
      Math.floor((resource.max - resource.value) / amount)
    );
    return Math.min(...maxByCosts, ...maxByGains, this.amount);
  }

  /**
   * Checks if the trade is partially or fully possible based on the given amount.
   */
  public isTradePossible(): boolean {
    return this.getMaxPossibleAmount() > 0;
  }

  /**
   * Executes the trade for the maximum feasible amount.
   */
  public executeTrade(): number {
    const maxPossibleAmount = this.getMaxPossibleAmount();

    if (maxPossibleAmount === 0) {
      console.warn("Trade not possible due to constraints");
      return 0;
    }

    // Deduct scaled costs
    this.costs.forEach(({ resource, amount }) => {
      resource.updateValueBy(-amount * maxPossibleAmount);
    });

    // Apply scaled gains
    this.gains.forEach(({ resource, amount }) => {
      resource.updateValueBy(amount * maxPossibleAmount);
    });

    return maxPossibleAmount;
  }

  /**
   * Evaluates the trade outcome for the maximum feasible amount without applying it.
   */
  public evaluateTrade(): { [key: string]: { before: number; after: number } } {
    const maxPossibleAmount = this.getMaxPossibleAmount();
    const result: { [key: string]: { before: number; after: number } } = {};

    // Evaluate scaled costs
    this.costs.forEach(({ resource, amount }) => {
      result[resource.key] = {
        before: resource.value,
        after: resource.respectConstraints(
          resource.value - amount * maxPossibleAmount
        ),
      };
    });

    // Evaluate scaled gains
    this.gains.forEach(({ resource, amount }) => {
      result[resource.key] = result[resource.key] || {
        before: resource.value,
        after: resource.value,
      };
      result[resource.key].after = resource.respectConstraints(
        result[resource.key].after + amount * maxPossibleAmount
      );
    });

    return result;
  }
}
