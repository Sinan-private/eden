import {resourceReferences} from "@/GameEngine/ResourceEngine/ResourceHandler/helpers/resourceReferences.ts";

const mockResources = [
  {
    key: 'wood',
    cost: {
      give: [{ key: 'stone', amount: 1 }],
      gain: [],
    },
    revealedAt: null,
  },
  {
    key: 'stone',
    cost: {
      give: [],
      gain: [],
    },
    revealedAt: {
      give: [],
      gain: [{ key: 'gold', amount: 2 }],
    },
  },
  {
    key: 'gold',
    cost: {
      give: [{ key: 'wood', amount: 3 }],
      gain: [],
    },
    revealedAt: null,
  },
]

describe('resourceReferences', () => {
  it('returns referencing keys for a given resource key', () => {
    expect(resourceReferences('wood', mockResources)).toEqual(['gold'])
    expect(resourceReferences('stone', mockResources)).toEqual(['wood'])
    expect(resourceReferences('gold', mockResources)).toEqual(['stone'])
  })

  it('does not return self-reference', () => {
    const selfReferencing = [
      {
        key: 'stone',
        cost: {
          give: [{ key: 'stone', amount: 1 }],
          gain: [],
        },
        revealedAt: null,
      }
    ]
    expect(resourceReferences('stone', selfReferencing)).toEqual([])
  })
})