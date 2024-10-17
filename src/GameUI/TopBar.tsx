import {useCallback} from "react";
import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";

export const TopBar = () => {
  const {state, get, check} = useGame().resources;

  const getResource = useCallback((type: ResourceTypes, increase = 1) => {
    const resource = (key: ResourceKeys) => get(key);
    return (
      <>
        {state.filter(resource => type === resource.type).map(({key}) => (
          <StyledTopBarResource key={key} onClick={() => resource(key).increment(increase)}>
            <img src={resource(key).getIcon()} alt={resource(key).label} width={32} height={32}/>
            <p>{check(resource(key).key).beautify.value}</p>
          </StyledTopBarResource>
        ))}
      </>
    )
  }, [state]);

  const currency = getResource('currency_resource', 100)
  const citizens = getResource('citizen_resource')

  return (
    <StyledTopBar>
      {currency}
      {citizens}
    </StyledTopBar>
  )
}

const StyledTopBar = styled.div`
    position: fixed;
    display: flex;
    min-width: 600px;
    min-height: 40px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 20px 12px 20px;
    background: #333333;
    gap: 16px;
    //border: 1px solid red;
    //border-top: transparent;
`
const StyledTopBarResource = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    
    img {
        margin-bottom: 4px;
    }

    p {
        margin: 0;
        padding: 2px 8px;
        border-radius: 20px;
        background-color: rgba(255, 255, 255, 0.13);
        font-size: 0.85rem;
        min-width: 8px;
    }
`;