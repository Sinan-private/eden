import { SimultaneousTrigger, SequenceTrigger, ProgressiveTrigger } from './EventTrigger.ts';

// Mock setup
const createGetter = (values) => (key) => ({ value: values[key] });

const baseProps = {
  type: 'simultaneous',
  resources: [
    { key: 'wood', value: 5 },
    { key: 'stone', value: 3 }
  ]
};

describe('EventTrigger subclasses', () => {
  it('SimultaneousTrigger is fulfilled only if all conditions are met at once', () => {
    const getByKey = createGetter({ wood: 5, stone: 3 });
    const trigger = new SimultaneousTrigger(baseProps, getByKey);
    expect(trigger.evaluate()).toBe(true);

    const getByKey2 = createGetter({ wood: 5, stone: 2 });
    const trigger2 = new SimultaneousTrigger(baseProps, getByKey2);
    expect(trigger2.evaluate()).toBe(false);
  });

  it('SequenceTrigger fulfills only in the defined order', () => {
    const getter = createGetter({ wood: 0, stone: 0 });
    const trigger = new SequenceTrigger(baseProps, getter);

    // 1. No resource is fulfilled yet
    expect(trigger.evaluate()).toBe(false);

    trigger.resources.forEach(r => r._getByKey = createGetter({ wood: 0, stone: 3 }));
    expect(trigger.evaluate()).toBe(false); // not done and stone is ignored because not in sequence

    // 2. First resource fulfilled (wood)
    trigger.resources.forEach(r => r._getByKey = createGetter({ wood: 5, stone: 0 }));
    expect(trigger.evaluate()).toBe(false); // still not done, but wood is now

    // 3. Second resource fulfilled (stone)
    trigger.resources.forEach(r => r._getByKey = createGetter({ wood: 0, stone: 3 }));
    expect(trigger.evaluate()).toBe(true); // ✅ Full sequence fulfilled

    // 4. Further calls should still return true
    expect(trigger.evaluate()).toBe(true);
  });

  it('ProgressiveTrigger fulfills resources in any order, over time', () => {
    const getter = createGetter({ wood: 0, stone: 0 });
    const trigger = new ProgressiveTrigger(baseProps, getter);

    // 1. No resource is fulfilled yet
    expect(trigger.evaluate()).toBe(false);

    // 2. First resource fulfilled (wood)
    trigger.resources.forEach(r => r._getByKey = createGetter({ wood: 0, stone: 3 }));
    expect(trigger.evaluate()).toBe(false); // not in sequence but stone fulfilled

    // 3. Second resource fulfilled (stone)
    trigger.resources.forEach(r => r._getByKey = createGetter({ wood: 5, stone: 0 }));
    expect(trigger.evaluate()).toBe(true); // ✅ All fulfilled

    // 4. Further calls should still return true
    expect(trigger.evaluate()).toBe(true);
  });

});
