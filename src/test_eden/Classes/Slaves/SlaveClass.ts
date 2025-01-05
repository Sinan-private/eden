import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {SLAVES_INITIALLY_ARWA, SLAVES_INITIALLY_MARID} from "../../constants/constants.ts";
import {randomRange} from "../../helpers/randomRange.ts";

type FactionKeys = 'ifrit' | 'marid' | 'arwa' | 'ghoul'


export class SlaveClass {
  public slaves_bound: ResourceClass;
  public slaves_roaming: ResourceClass;
  public slaves_enslaved: ResourceClass;
  public slaves_wasted: ResourceClass;
  public slaves_in_rebirth: ResourceClass;
  public owned_by_ifrid: number = 0;
  public owned_by_marid: number = SLAVES_INITIALLY_MARID;
  public owned_by_arwa: number = SLAVES_INITIALLY_ARWA;
  public owned_by_ghoul: number = 0;
  public slave_health: ResourceClass;

  constructor(_resourceStore: ResourceStoreClass) {
    this.slaves_bound = _resourceStore.get('slaves_bound')
    this.slaves_roaming = _resourceStore.get('slaves_roaming')
    this.slaves_enslaved = _resourceStore.get('slaves_enslaved')
    this.slaves_wasted = _resourceStore.get('slaves_wasted')
    this.slaves_in_rebirth = _resourceStore.get('slaves_in_rebirth')
    this.slave_health = _resourceStore.get('slave_health')
  }

  public bindSlave = (amount = 1) => {

  }

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
    // this.getOwnedByFaction(faction) += amount;
    switch (faction) {
      case 'ifrit':
        return this.owned_by_ifrid += maxPossible;
      case 'marid':
        return this.owned_by_marid += maxPossible;
      case 'arwa':
        return this.owned_by_arwa += maxPossible;
      case 'ghoul':
        return this.owned_by_ghoul += maxPossible;
      default:
        throw new Error(`Unknown faction ${faction}`);
    }
  }

  public takeFromFaction = (faction: FactionKeys, amount = 1) => {

  }

  public canTakeFromFaction = (faction: FactionKeys, amount = 1)  => {

  }

  public waste = () => {

  }

  public getOwnedByFaction = (faction: FactionKeys) => {
    switch (faction) {
      case 'ifrit':
        return this.owned_by_ifrid;
      case 'marid':
        return this.owned_by_marid;
      case 'arwa':
        return this.owned_by_arwa;
      case 'ghoul':
        return this.owned_by_ghoul;
      default:
        throw new Error(`Unknown faction ${faction}`);
    }
  }

  get assigned_slaves() {
    return this.owned_by_ifrid
      + this.owned_by_marid
      + this.owned_by_arwa
      + this.owned_by_ghoul
  }

  get unassigned_slaves() {
    return this.slaves_enslaved.value - this.assigned_slaves
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