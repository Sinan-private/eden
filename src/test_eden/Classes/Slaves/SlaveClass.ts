import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {randomRange} from "../../helpers/randomRange.ts";
import {Resource} from "../../../Resource/ResourceHandler";

// const slaveAssignments = [
//   'digger',
//   'blacksmith'
// ] as const;
// type SlaveAssignments = typeof slaveAssignments[number];
type SlaveAssignments = 'digger' | 'blacksmith'

// The concept
// Slaves can exist in different stages
// - bound -> this is the absolute maximum. It is defined by the amount of people that made a contract with the devil. All combined states can never exceed this limit
// - roaming -> these can be caught by the slave hunters
// - enslaved -> this can be either unassigned or assigned to any faction
// - wasted -> Their done for, no good to serve. They can either be burned for stamina or acid, or consumed for hp.
// - in_rebirth -> Slaves spend some time in rebirth before jumping back to the roaming state (this can just be a single state that gains more with more slaves in rebirth)

// bound 100
// roaming 20
// enslaved 50
// wasted 10
// in_rebirth 20

export class SlaveClass {
  public slaves_bound: ResourceClass = new Resource({key: 'slaves_bound'})
  public slave_limit: ResourceClass;
  public slave_unassigned: ResourceClass;
  public slave_diggers: ResourceClass;
  public slave_blacksmiths: ResourceClass;
  public slave_health: ResourceClass;

  constructor(_resourceStore: ResourceStoreClass) {
    this.slave_limit = _resourceStore.get('slave_limit')
    this.slave_unassigned = _resourceStore.get('slave_unassigned')
    this.slave_diggers = _resourceStore.get('slave_diggers')
    this.slave_blacksmiths = _resourceStore.get('slave_blacksmiths')
    this.slave_health = _resourceStore.get('slave_health')
  }


  public test = () => {
  //   this.
  }

  public addSlave = (amount = 1) => {
    if (!this.slave_limit.is_max) {
      this.slave_limit.updateValueBy(amount)
      this.slave_unassigned.updateValueBy(amount)
    }
  }

  public wasteSlave = (amount = 1) => {
    // Kill as many unassigned as needed. The rest is randomly taken from the professions
    if (!this.slave_unassigned.value) {
      this.unassignRandom(amount)
    }
      this.slave_unassigned.updateValueBy(-amount)
      this.slave_limit.updateValueBy(-amount)
  }

  public unassignRandom = (amount = 1) => {
    const digger = Array.from(Array(this.slave_diggers.state.value)).map(() => 'digger')
    const blacksmith = Array.from(Array(this.slave_blacksmiths.state.value)).map(() => 'blacksmith')
    const working_slaves = digger.concat(blacksmith)
    const _amount = limitAmount(amount, working_slaves.length)
    for (let i = 0; i < _amount; i++) {
      const index = randomRange(0, working_slaves.length -1)
      const from = working_slaves[index] as SlaveAssignments;
      this.unassignSlaves(from)
    }
  }

  public assignSlaves = (to: SlaveAssignments, amount = 1) => {
    const _amount = amount <= this.slave_unassigned.value ? amount : this.slave_unassigned.value;
    switch (to) {
      case 'digger':
        this.slave_diggers.updateValueBy(_amount)
        this.slave_unassigned.updateValueBy(-_amount)
        break;
      case 'blacksmith':
        this.slave_blacksmiths.updateValueBy(_amount)
        this.slave_unassigned.updateValueBy(-_amount)
        break;
      default:
    }
  }

  public unassignSlaves = (from: SlaveAssignments, amount = 1) => {
    const getAmount = (max: number) => limitAmount(amount, max)
    switch (from) {
      case 'digger':
        this.slave_unassigned.updateValueBy(getAmount(this.slave_diggers.value))
        this.slave_diggers.updateValueBy(-getAmount(this.slave_diggers.value))
        break;
      case 'blacksmith':
        this.slave_unassigned.updateValueBy(getAmount(this.slave_blacksmiths.value))
        this.slave_blacksmiths.updateValueBy(-getAmount(this.slave_blacksmiths.value))
        break;
      default:
    }
  }

  get assigned_slaves() {
    return this.slave_diggers.value + this.slave_blacksmiths.value
  }

  get slave_count() {
    return this.slave_unassigned.value + this.slave_diggers.value + this.slave_blacksmiths.value
  }

  get is_max() {
    return this.slave_count >= this.slave_limit.max
  }

  get max() {
    return Math.floor(this.slave_limit.max)
  }

  public turnUpdate = () => {
    if (this.slave_health.value) {
      this.slave_health.updateValueBy(-0.1)
    } else if (this.slave_count) {
      this.slave_health.setValueTo(100)
      this.wasteSlave(1)
    }
  }
}

const limitAmount = (val: number, max: number) => val <= max ? val : max

