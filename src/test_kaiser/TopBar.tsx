import {useCallback} from "react";
import styled from "styled-components";
import {ResourceKeys, ResourceTypes} from "../Resource";
import {useResource} from "../Resource/context/resource.context.ts";

export const TopBar = () => {
  const {get, getByType} = useResource().resources;

  const getResource = useCallback((type: ResourceTypes) => {
    const resource = (key: ResourceKeys) => get(key);
    return (
      <>
        {getByType(type).map(({key}) => (
          <StyledTopBarResource key={key}>
            <img src={resource(key).icon} alt={resource(key).label} width={32} height={32}/>
            <p>{get(resource(key).key).beautify.value}</p>
          </StyledTopBarResource>
        ))}
      </>
    )
  }, [get, getByType]);

  const currency = getResource('currency_resource')
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
    z-index: 1;
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
