import styled from "styled-components";
import {useGame} from "./context/game.context.ts";
import {ResourceClass} from "./gameRules/types.ts";
import {useMemo} from "react";

export const Game = () => {
  const {
    resource,
    tick,
  } = useGame();
  const {current, isActive, start, stop} = tick;
  const {state, check} = resource

  return (
    <>
      <TopBar />
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {state.filter(({type}) => type === "base_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}} />
          {state.filter(({type}) => type === "processed_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
        </div>
        {/*<div className="card">*/}
        {/*  {state.filter(({type}) => type === "citizen_resource").map(({key}) => (*/}
        {/*    <Button key={key} resource={check(key)}/>*/}
        {/*  ))}*/}
        {/*</div>*/}
        <div className="card">
          {state.filter(({type}) => type === "build_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
        </div>


      </div>
      <div>
        Turn {current}
        <button onClick={isActive ? stop : start}>{isActive ? 'x' : '>'}</button>
      </div>
    </>
  )
}

type ButtonProps = {
  resource: ResourceClass;
  increment?: number;
}

const Button = ({resource, increment = 1}: ButtonProps) => {
  const {onUpdate, onTrade} = useGame().resource;
  const onButtonClick = () => resource.has_trade
    ? onTrade(resource.trade)
    : onUpdate({key: resource.key, value: increment})

  return (
    <button onClick={onButtonClick}>
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginRight: 16}}>
        <img src={resource.icon} alt={resource.label} width={32} height={32} />
        <span style={{fontSize: '0.7rem'}}>{resource.label}</span>
      </div>
       {resource.value}
    </button>
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

const TopBar = () => {
  const {onUpdate, onTrade, state, check} = useGame().resource;

  const currency = useMemo(() => {

    return (
      <>
        {state.filter(({type}) => type === "currency_resource").map(resource => (
          <StyledTopBarResource key={resource.key} >
            <img src={check(resource.key).icon} alt={resource.label} width={32} height={32} />
            <p>{check(resource.key).beautify.value}</p>
          </StyledTopBarResource>
        ))}
      </>
    )

  }, []);


  return (
    <StyledTopBar>
      {currency}
      {state.filter(({type}) => type === "currency_resource").map(resource => (
        <StyledTopBarResource key={resource.key} >
          <img src={check(resource.key).icon} alt={resource.label} width={32} height={32} />
          <p>{check(resource.key).beautify.value}</p>
        </StyledTopBarResource>
      ))}
      {state.filter(({type}) => type === "citizen_resource").map(resource => (
        <StyledTopBarResource key={resource.key} >
          <img src={check(resource.key).icon} alt={resource.label} width={32} height={32}/>
          <p>{check(resource.key).beautify.value}</p>
        </StyledTopBarResource>
      ))}
    </StyledTopBar>
  )
}