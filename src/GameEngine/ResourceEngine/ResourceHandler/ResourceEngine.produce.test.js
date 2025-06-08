import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResourceEngine } from './ResourceEngine.js'

describe('ResourceEngine.produce', () => {
  let store
  let mockResource
  let mockTrade

  beforeEach(() => {
    store = new ResourceEngine([])

    mockTrade = {
      isTradePossible: vi.fn(() => true),
      getMaxPossibleAmount: vi.fn(() => 5),
      executeTrade: vi.fn(),
    }

    mockResource = {
      key: 'wood',
      cost: {
        give: [{ key: 'stone', value: 1 }],
        gain: [],
      },
      updateValueBy: vi.fn(),
    }

    // override getByKey to return our mocked resource
    store.getByKey = () => mockResource

    // override getTradeChange to return our mocked trade
    store.getTradeChange = vi.fn(() => mockTrade)
  })

  it('executes trade if possible and enough amount is available', () => {
    store.produce('wood', 2)

    // expect(store.getTradeChange).toHaveBeenCalled()
    expect(mockTrade.isTradePossible).toHaveBeenCalled()
    expect(mockTrade.getMaxPossibleAmount).toHaveBeenCalled()
    expect(mockTrade.executeTrade).toHaveBeenCalled()
  })

  it('does not execute trade if not possible', () => {
    mockTrade.isTradePossible.mockReturnValue(false)

    store.produce('wood', 2)

    expect(mockTrade.executeTrade).not.toHaveBeenCalled()
  })

  it('updates value directly if no cost exists', () => {
    mockResource.cost = null

    store.produce('wood', 3)

    expect(mockResource.updateValueBy).toHaveBeenCalledWith(3)
    expect(mockTrade.executeTrade).not.toHaveBeenCalled()
  })

  it('does nothing if amount is falsy', () => {
    store.produce('wood', 0)
    store.produce('wood')

    expect(mockResource.updateValueBy).not.toHaveBeenCalled()
    expect(mockTrade.executeTrade).not.toHaveBeenCalled()
  })
})
