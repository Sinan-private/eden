import {describe, it, expect, vi, beforeEach} from 'vitest'
import {ResourceEngine} from './ResourceEngine.js'
import * as resourceRefModule from '@/GameEngine/ResourceEngine/ResourceHandler/helpers/resourceReferences'

// 🔁 Mock resourceReferences globally
vi.mock('@/GameEngine/ResourceEngine/ResourceHandler/helpers/resourceReferences', () => ({
  resourceReferences: vi.fn()
}))

describe('ResourceEngine.replaceTradeKeys', () => {
  let store

  const mock_1 = {
    id: 'stone-id',
    key: 'stone',
    value: 0,
    cost: {
      give: [{key: 'wood', value: 1}],
      gain: [],
    },
  }

  const mock_2 = {
    id: 'gold-id',
    key: 'gold',
    value: 0,
    cost: {
      give: [{key: 'wood', value: 2}],
      gain: [],
    },
  }
  const createState = (resource) => ({...resource, state: resource})
  const mock_resource_1 = createState(mock_1)
  const mock_resource_2 = createState(mock_2)

  beforeEach(() => {
    vi.clearAllMocks()

    // Create empty store (resources don't matter here, as we'll mock getByKey)
    store = new ResourceEngine([])

    // Overwrite getByKey directly (arrow method, not spyable)
    store.getByKey = (key) => {
      if (key === 'stone') return mock_resource_1
      if (key === 'gold') return mock_resource_2
      throw new Error(`Unexpected key: ${key}`)
    }
  })

  it('returns updated states for all resources referencing the old key', () => {
    resourceRefModule.resourceReferences.mockReturnValue(['stone', 'gold'])

    const result = store.replaceTradeKeys('wood', 'coal')

    expect(resourceRefModule.resourceReferences).toHaveBeenCalledWith('wood', store.allResources)

    expect(result).toEqual([
      {
        id: 'stone-id',
        value: 0,
        key: 'stone',
        cost: {
          give: [{key: 'coal', value: 1}],
          gain: [],
        }
      },
      {
        id: 'gold-id',
        value: 0,
        key: 'gold',
        cost: {
          give: [{key: 'coal', value: 2}],
          gain: [],
        }
      }
    ])
  })

  it('returns empty array if key and newKey are the same', () => {
    const result = store.replaceTradeKeys('wood', 'wood')
    expect(result).toEqual([])
    expect(resourceRefModule.resourceReferences).not.toHaveBeenCalled()
  })
})
