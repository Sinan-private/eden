import {ResourceTrigger} from "./ResourceTrigger.ts";

describe('ResourceTrigger', () => {
  let getByKey;

  beforeEach(() => {
    getByKey = (key) => {
      return {
        wood: { value: 10 },
        stone: { value: 5 }
      }[key];
    };
  });

  it('is fulfilled when value >= threshold for min factor', () => {
    const trigger = new ResourceTrigger({ key: 'wood', value: 5, factor: 'min' }, getByKey);
    expect(trigger.isCompleted).toBe(true);
  });

  it('is not fulfilled when value < threshold for min factor', () => {
    const trigger = new ResourceTrigger({ key: 'wood', value: 15, factor: 'min' }, getByKey);
    expect(trigger.isCompleted).toBe(false);
  });

  it('is fulfilled when value <= threshold for max factor', () => {
    const trigger = new ResourceTrigger({ key: 'stone', value: 5, factor: 'max' }, getByKey);
    expect(trigger.isCompleted).toBe(true);
  });

  it('is not fulfilled when value > threshold for max factor', () => {
    const trigger = new ResourceTrigger({ key: 'stone', value: 3, factor: 'max' }, getByKey);
    expect(trigger.isCompleted).toBe(false);
  });

  it('defaults to min factor when not provided', () => {
    const trigger = new ResourceTrigger({ key: 'wood', value: 5 }, getByKey);
    expect(trigger.isCompleted).toBe(true);
  });
});
