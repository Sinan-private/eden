import {describe, it, expect, beforeEach, vi} from 'vitest'
import { Resource } from './Resource'
import * as idModule from '../helpers/id.ts'


describe('Resource', () => {
  let resource

  beforeEach(() => {
    vi.spyOn(idModule, 'id').mockReturnValue('mock_id')
    resource = new Resource({
      id: 'should_not_be_passed',
      key: 'wood',
      label: 'Wood',
      type: 'material',
      value: 10,
      min: 0,
      max: 100,
    })
  })

  it('should not accept a provided id but handle it internally', () => {
    expect(resource.id).toBe('mock_id')
  });

  it('initializes with default values', () => {
    expect(resource.key).toBe('wood')
    expect(resource.label).toBe('Wood')
    expect(resource.value).toBe(10)
    expect(resource.min).toBe(0)
    expect(resource.max).toBe(100)
    expect(resource.iconName).toBe('empty')
  })

  it('setValueTo respects constraints and updates session/lifetime', () => {
    expect(resource.setValueTo(120)).toBe(true) // should clamp to 100
    expect(resource.value).toBe(100)
    expect(resource.lifetimeEarned).toBe(90)

    expect(resource.setValueTo(-10)).toBe(true) // should clamp to 0
    expect(resource.value).toBe(0)
    expect(resource.sessionSpent).toBe(-100)
  })

  it('updateValueBy adds/subtracts properly', () => {
    resource.updateValueBy(5)
    expect(resource.value).toBe(15)
    resource.updateValueBy(-10)
    expect(resource.value).toBe(5)
  })

  it('setTo overrides all values correctly', () => {
    const newState = {
      id: 'should_be_passed_here',
      key: 'wood_changed',
      label: 'Wood_changed',
      type: 'material_changed',
      value: 150,
      min: 10,
      max: 110
    }
    resource.setTo(newState)
    expect(resource.id).toBe('should_be_passed_here')
    expect(resource.key).toBe('wood_changed')
    expect(resource.label).toBe('Wood_changed')
    expect(resource.type).toBe('material_changed')
    expect(resource.value).toBe(110)
    expect(resource.min).toBe(10)
    expect(resource.max).toBe(110)
  })

  it('hasEnough returns correct boolean', () => {
    expect(resource.hasEnough(5)).toBe(true)
    expect(resource.hasEnough(15)).toBe(false)
  })

  it('clone creates a new resource with reference_id', () => {
    const clone = resource.clone()
    expect(clone).not.toBe(resource)
    expect(clone.reference_id).toBe(resource.id)
    expect(clone.key).toBe(resource.key)
  })

  it('resetSession sets session counters to 0', () => {
    resource.sessionEarned = 10
    resource.sessionSpent = -5
    resource.resetSession()
    expect(resource.sessionEarned).toBe(0)
    expect(resource.sessionSpent).toBe(0)
  })

  it('progress returns fractional progress as percentage', () => {
    resource.setValueTo(10.25)
    expect(resource.progress).toBeCloseTo(25)
  })

  it('is_max and is_min behave correctly', () => {
    resource.setValueTo(100)
    expect(resource.is_max).toBe(true)
    expect(resource.is_min).toBe(false)

    resource.setValueTo(0)
    expect(resource.is_min).toBe(true)
    expect(resource.is_max).toBe(false)
  })
})
