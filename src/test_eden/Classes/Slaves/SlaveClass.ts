import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {SLAVES_INITIALLY_ARWA, SLAVES_INITIALLY_MARID} from "../../constants/constants.ts";
import {randomChances} from "../../helpers/randomChances.ts";
import {makeAutoObservable} from "mobx";

type FactionKeys = 'ifrit' | 'marid' | 'arwa' | 'ghoul'
// type FactionKeys = Pick<keyof SlaveClass, 'ifrit' | 'marid' | 'arwa' | 'ghoul'>

// The slave
// - limit -> This is the total maximum of slaves that the player can have at a time
// - bound -> This is the total maximum of slaves that the player repeatedly receives back.
// Slaves exist in different states
// - in_rebirth -> After dying on Earth or in eden a slave enters the state of rebirth for some time before going back to eden
//    enslaved + in_rebirth can never exceed bound. This is a nice way to only return the slaves that are owned
//    and reducing extra slaves over time
// - roaming -> The slave is back in Eden, but needs yet to be caught by the slave hunters
// - enslaved -> Ah the state we want. The slave can be given to a faction to serve
// - wasted -> That one is done for. Now use for this slave other than burning it for fuel or consuming it with Behemoth
// - consumed -> It takes some timme to burn and produce fuel. That's that time.
// This is also the order that a slave goes through those states. A new one starting in bound, a wasted one starting in_rebirth
// There should still be an option to add foreign_slaves to the sum. Those can be used like any other but
// they will be destroyed after their wasted state

export class SlaveClass {
  public limit: ResourceClass;
  public slaves_bound: ResourceClass;
  public slaves_in_rebirth: ResourceClass;
  public slaves_roaming: ResourceClass;
  public slaves_enslaved: ResourceClass;
  public slaves_wasted: ResourceClass;
  public slaves_consumed: ResourceClass;
  public ifrit: number = 0;
  public marid: number = SLAVES_INITIALLY_MARID;
  public arwa: number = SLAVES_INITIALLY_ARWA;
  public ghoul: number = 0;
  public slave_health: ResourceClass;

  constructor(private _resourceStore: ResourceStoreClass) {
    this.limit = _resourceStore.get('slaves_limit')
    this.slaves_bound = _resourceStore.get('slaves_bound')
    this.slaves_in_rebirth =  _resourceStore.get('slaves_in_rebirth')
    this.slaves_roaming = _resourceStore.get('slaves_roaming')
    this.slaves_enslaved = _resourceStore.get('slaves_enslaved')
    this.slaves_wasted = _resourceStore.get('slaves_wasted')
    this.slaves_consumed = _resourceStore.get('slaves_consumed')
    this.slave_health = _resourceStore.get('slave_health')
    makeAutoObservable(this)
  }

  // public bindSlave = (amount = 1) => {
  //
  // }
  // get slaves_in_rebirth() {
  //   console.log(this._slaves_in_rebirth.value, this.max_slaves_in_rebirth)
  //   return this._slaves_in_rebirth.value
  // }
  get slaves_in_eden() {
    return this.slaves_in_rebirth.value
      + this.slaves_roaming.value
      + this.slaves_enslaved.value
      + this.slaves_wasted.value
      + this.slaves_consumed.value
  }
  get max_slaves_in_rebirth() {
    return this.slaves_bound.value - this.slaves_in_eden
  }
  public addSlaveToRebirth = (amount = 1) => {
    const maxPossible = amount <= this.max_slaves_in_rebirth ? amount : this.max_slaves_in_rebirth;
    this.slaves_in_rebirth.updateValueBy(maxPossible);
  }
  public removeSlaveFromRebirth = (amount = 1) => {
    this.slaves_in_rebirth.updateValueBy(-amount);
  }

  public resurrect = () => {
    this._resourceStore
      .trade([{key: 'slaves_consumed', value: 1}], [{key: 'slaves_in_rebirth', value: 1}])
      .tradeIfPossible()
  }

  public revive = () => {
    this._resourceStore
      .trade([{key: 'slaves_in_rebirth', value: 1}], [{key: 'slaves_roaming', value: 1}])
      .tradeIfPossible()
  }

  public enslave = () => {
    this._resourceStore
      .trade([{key: 'slaves_roaming', value: 1}], [{key: 'slaves_enslaved', value: 1}])
      .tradeIfPossible()
  }

  public addToFaction = (faction: FactionKeys, amount = 1) => {
    const maxPossible = amount <= this.unassigned_slaves ? amount : this.unassigned_slaves;
    this[faction] += maxPossible
  }

  public removeFromFaction = (faction: FactionKeys, amount = 1) => {
    const maxPossible = amount <= this[faction] ? amount : this[faction];
    this[faction] -= maxPossible
  }

  public canTakeFromFaction = (faction: FactionKeys, amount = 1) =>
    this[faction] >= amount;

  public waste = () => {
    if (!this.unassigned_slaves) {
      this.unassignRandom()
    }
    this._resourceStore
      .trade([{key: 'slaves_enslaved', value: 1}], [{key: 'slaves_wasted', value: 1}])
      .tradeIfPossible()
  }
  public consume = () => {
    this._resourceStore
      .trade([{key: 'slaves_wasted', value: 1}], [{key: 'slaves_consumed', value: 1}])
      .tradeIfPossible()
  }
  // public revive

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

  public unassignRandom = () => {
    const chances: { chance: number; key: FactionKeys }[] = [
      {
        key: 'ifrit',
        chance: this.ifrit,
      },
      {
        key: 'marid',
        chance: this.marid,
      },
      {
        key: 'arwa',
        chance: this.arwa,
      },
      {
        key: 'ghoul',
        chance: this.ghoul,
      },
    ]
    const randomKey = randomChances(chances).key;
    if (this[randomKey] > 0) {
      this[randomKey]--
    }
  }

  public turnUpdate = () => {
    if (this.slave_health.value) {
      this.slave_health.updateValueBy(-0.1)
    }
    else {
      this.slave_health.setValueTo(100)
      this.waste()
    }
  }
}