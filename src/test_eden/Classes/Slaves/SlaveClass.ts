import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {SLAVES_INITIALLY_ARWA, SLAVES_INITIALLY_MARID} from "../../constants/constants.ts";

type FactionKeys = 'ifrit' | 'marid' | 'arwa' | 'ghoul'
// type FactionKeys = Pick<keyof SlaveClass, 'ifrit' | 'marid' | 'arwa' | 'ghoul'>


export class SlaveClass {
  public slaves_bound: ResourceClass;
  public slaves_roaming: ResourceClass;
  public slaves_enslaved: ResourceClass;
  public slaves_wasted: ResourceClass;
  public slaves_in_rebirth: ResourceClass;
  public ifrit: number = 0;
  public marid: number = SLAVES_INITIALLY_MARID;
  public arwa: number = SLAVES_INITIALLY_ARWA;
  public ghoul: number = 0;
  public slave_health: ResourceClass;

  constructor(_resourceStore: ResourceStoreClass) {
    this.slaves_bound = _resourceStore.get('slaves_bound')
    this.slaves_roaming = _resourceStore.get('slaves_roaming')
    this.slaves_enslaved = _resourceStore.get('slaves_enslaved')
    this.slaves_wasted = _resourceStore.get('slaves_wasted')
    this.slaves_in_rebirth = _resourceStore.get('slaves_in_rebirth')
    this.slave_health = _resourceStore.get('slave_health')
  }

  // public bindSlave = (amount = 1) => {
  //
  // }

  public revive = (amount = 1) => {
    // Nope, here I need to calculate how many are actually available
    const maxPossible = amount <= this.slaves_in_rebirth.value ? amount : this.slaves_in_rebirth.value;
    this.slaves_in_rebirth.updateValueBy(-maxPossible)
    this.slaves_roaming.updateValueBy(maxPossible)
  }

  public enslave = (amount = 1) => {
    const maxPossible = amount <= this.slaves_roaming.value ? amount : this.slaves_roaming.value;
    this.slaves_roaming.updateValueBy(-maxPossible)
    this.slaves_enslaved.updateValueBy(maxPossible)
  }

  public giveToFaction = (faction: FactionKeys, amount = 1) => {
    const maxPossible = amount <= this.unassigned_slaves ? amount : this.unassigned_slaves;
    this[faction] += maxPossible
  }

  public takeFromFaction = (faction: FactionKeys, amount = 1) => {
    const maxPossible = amount <= this[faction] ? amount : this[faction];
    this[faction] -= maxPossible
  }

  public canTakeFromFaction = (faction: FactionKeys, amount = 1)  =>
    this[faction] >= amount;

  public waste = () => {

  }

  public getOwnedByFaction = (faction: FactionKeys) => {
    switch (faction) {
      case 'ifrit':
        return this.ifrit;
      case 'marid':
        return this.marid;
      case 'arwa':
        return this.arwa;
      case 'ghoul':
        return this.ghoul;
      default:
        throw new Error(`Unknown faction ${faction}`);
    }
  }

  get assigned_slaves() {
    return this.ifrit
      + this.marid
      + this.arwa
      + this.ghoul
  }

  get unassigned_slaves() {
    return this.slaves_enslaved.value - this.assigned_slaves
  }

  get can_enslave() {
    return !!this.slaves_roaming.value
  }


  // public unassignRandom = (amount = 1) => {
  //   const digger = Array.from(Array(this.slave_diggers.state.value)).map(() => 'digger')
  //   const blacksmith = Array.from(Array(this.slave_blacksmiths.state.value)).map(() => 'blacksmith')
  //   const working_slaves = digger.concat(blacksmith)
  //   const _amount = limitAmount(amount, working_slaves.length)
  //   for (let i = 0; i < _amount; i++) {
  //     const index = randomRange(0, working_slaves.length -1)
  //     const from = working_slaves[index] as SlaveAssignments;
  //     this.unassignSlaves(from)
  //   }
  // }

  public turnUpdate = () => {
    if (this.slave_health.value) {
      this.slave_health.updateValueBy(-0.1)
    }
    // else if (this.slave_count) {
    //   this.slave_health.setValueTo(100)
    //   this.wasteSlave(1)
    // }
  }
}