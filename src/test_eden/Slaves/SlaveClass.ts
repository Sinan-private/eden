import {ResourceClass, ResourceStoreClass} from "../../Resource";

const slaveAssignments = [
  'digger',
  'blacksmith'
] as const;
type SlaveAssignments = typeof slaveAssignments[number];

export class SlaveClass {
  private _slave_limit: ResourceClass;
  private _slave_unassigned: ResourceClass;
  private _slave_diggers: ResourceClass;
  private _slave_blacksmiths: ResourceClass;
  private _slave_health: ResourceClass;

  constructor(_resourceStore: ResourceStoreClass) {
    this._slave_limit = _resourceStore.get('slave_limit')
    this._slave_unassigned = _resourceStore.get('slave_unassigned')
    this._slave_diggers = _resourceStore.get('slave_diggers')
    this._slave_blacksmiths = _resourceStore.get('slave_blacksmiths')
    this._slave_health = _resourceStore.get('slave_health')
  }

  public addSlave = (amount = 1) => {
    console.log(this._slave_limit)
    if (!this._slave_limit.is_max) {
      this._slave_limit.updateValueBy(amount)
      this._slave_unassigned.updateValueBy(amount)
    }
  }

  public wasteSlave = (amount = 1) => {
    // Kill as many unassigned as needed. The rest is randomly taken from the professions
    if (!this.slave_unassigned) {
      this.unassignRandom(amount)
    }
      this._slave_unassigned.updateValueBy(-amount)
      this._slave_limit.updateValueBy(-amount)
  }

  public unassignRandom = (amount = 1) => {
    const digger = Array.from(Array(this.slave_diggers)).map(() => 'digger')
    const blacksmith = Array.from(Array(this.slave_blacksmiths)).map(() => 'blacksmith')
    const working_slaves = digger.concat(blacksmith)
    const _amount = limitAmount(amount, working_slaves.length)
    for (let i = 0; i < _amount; i++) {
      const index = randomRange(0, working_slaves.length)
      const from = working_slaves[index] as SlaveAssignments;
      this.unassignSlaves(from)
    }
  }

  public assignSlaves = (to: SlaveAssignments, amount = 1) => {
    const _amount = amount <= this.slave_unassigned ? amount : this.slave_unassigned;
    switch (to) {
      case 'digger':
        this._slave_diggers.updateValueBy(_amount)
        this._slave_unassigned.updateValueBy(-_amount)
        break;
      case 'blacksmith':
        this._slave_blacksmiths.updateValueBy(_amount)
        this._slave_unassigned.updateValueBy(-_amount)
        break;
      default:
    }
  }

  public unassignSlaves = (from: SlaveAssignments, amount = 1) => {
    const getAmount = (max: number) => limitAmount(amount, max)
    switch (from) {
      case 'digger':
        this._slave_unassigned.updateValueBy(getAmount(this.slave_diggers))
        this._slave_diggers.updateValueBy(-getAmount(this.slave_diggers))
        break;
      case 'blacksmith':
        this._slave_unassigned.updateValueBy(getAmount(this.slave_blacksmiths))
        this._slave_blacksmiths.updateValueBy(-getAmount(this.slave_blacksmiths))
        break;
      default:
    }
  }

  get assigned_slaves() {
    return this.slave_diggers + this.slave_blacksmiths
  }

  get slave_count() {
    return this.slave_unassigned + this.slave_diggers + this.slave_blacksmiths
  }

  get slave_unassigned() {
    return Number(this._slave_unassigned.beautify.value)
  }

  get slave_diggers() {
    return Number(this._slave_diggers.beautify.value)
  }

  get slave_blacksmiths() {
    return Number(this._slave_blacksmiths.beautify.value)
  }

  get slave_health() {
    return Number(this._slave_health.value)
  }

  get is_max() {
    return this.slave_count >= this._slave_limit.max
  }

  public turnUpdate = () => {
    if (this.slave_health) {
      this._slave_health.updateValueBy(-0.1)
    } else if (this.slave_count) {
      this._slave_health.setValueTo(100)
      this.wasteSlave(1)
    }
  }
}

const limitAmount = (val: number, max: number) => val <= max ? val : max

const randomRange = (from: number, to: number) => {
  if (to < from) {
    console.warn('to is lower then from here')
    return to;
  }
  const delta = to - from;

  return Math.floor(Math.random() * delta + from)
};
