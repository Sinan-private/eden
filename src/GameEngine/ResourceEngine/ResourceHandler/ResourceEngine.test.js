import { describe, it, expect, vi } from 'vitest'
import {ResourceEngine} from "@/GameEngine/ResourceEngine/ResourceHandler/ResourceEngine.ts";
import * as resourceRefModule from '@/GameEngine/ResourceEngine/ResourceHandler/helpers/resourceReferences'


vi.mock('@/GameEngine/ResourceEngine/ResourceHandler/helpers/resourceReferences', () => ({
  resourceReferences: vi.fn(() => []),
}))

let store
beforeEach(() => {
  vi.clearAllMocks()
  store = new ResourceEngine(mock_resources)
})

const mock_resource_1 = {key: 'mock_resource_1', value: 1}
const mock_resource_2 = {
  key: 'mock_resource_2',
  value: 20,
  cost: {
    gain: [{key: 'mock_resource_1'}],
    give: []
  }
}


const mock_resources = [
  mock_resource_1,
  mock_resource_2,
]

describe('ResourceStore', () => {
  it('should create and provide according resources with getByKey', () => {
    // expect(store.getByKey('mock_resource_1')).toBeDefined()
    // expect(store.getByKey('mock_resource_2')).toBeDefined()
    // expect(store.getByKey('mock_resource_3')).toBeUndefined()
  });

  it('should allow to addResource', () => {
    expect(store.allResources.length).toBe(2)
    store.addResource({key: 'mock_resource_3', value: 300})
    expect(store.allResources.length).toBe(3)
    expect(store.getByKey('mock_resource_3')).toBeDefined()
  });

  it('should allow to removeResource', () => {
    const {id} = store.getByKey('mock_resource_1')
    expect(store.allResources.length).toBe(2)
    store.removeResource(id)
    expect(store.allResources.length).toBe(1)
  });

  it('should call resourceReferences with the right props', () => {
    store.resourceReferences('mock_resource_1')
    expect(resourceRefModule.resourceReferences).toHaveBeenCalledOnce()
    expect(resourceRefModule.resourceReferences).toHaveBeenCalledWith('mock_resource_1', store.allResources)
  });

  it('isResourceReferenced returns true when resourceReferences returns non-empty array', () => {
    resourceRefModule.resourceReferences.mockReturnValue(['someKey'])
    const result = store.isResourceReferenced('mock_resource_1')
    expect(resourceRefModule.resourceReferences).toHaveBeenCalledWith('mock_resource_1', store.allResources)
    expect(result).toBe(true)
  })

  it('isResourceReferenced returns false when resourceReferences returns empty array', () => {
    resourceRefModule.resourceReferences.mockReturnValue([])
    const result = store.isResourceReferenced('mock_resource_2')
    expect(resourceRefModule.resourceReferences).toHaveBeenCalledWith('mock_resource_2', store.allResources)
    expect(result).toBe(false)
  })
  it('__replaceTradeKey should replace one key with another', () => {
    const mock = {...mock_resource_2, state: mock_resource_2, id: 'mock_id_2'}
    const result = store.__replaceTradeKey(mock, 'mock_resource_1', 'mock_resource_3')
    const expected = {
      id: 'mock_id_2',
      key: 'mock_resource_2',
      value: 20,
      cost: {
        gain: [{key: 'mock_resource_3'}],
        give: []
      }
    }
    expect(result).toEqual(expected)
  });
});
