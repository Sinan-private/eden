import {useGame} from "../context/game.context.ts";
import {ResourceClass} from "../gameRules/types.ts";
import {TopBar} from "./TopBar.tsx";
import styled from "styled-components";

export const Game = () => {
  const {
    state,
    check
  } = useGame().resources;

  return (
    <>
      <TopBar/>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {state.filter(({type}) => type === "base_resource").map(({key}) => (
            <Button key={key} resource={check(key)} increment={10}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {state.filter(({type}) => type === "processed_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
        </div>
        <div className="card">
          {state.filter(({type}) => type === "build_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
        </div>
      </div>
      <GameControl/>
    </>
  )
}

type ButtonProps = {
  resource: ResourceClass;
  increment?: number;
}

const Button = ({resource, increment = 1}: ButtonProps) => {
  const {
    getResourceTurnUpdate,
  resources: {
    onUpdate, onTrade
  }} = useGame();
  const onButtonClick = () => resource.has_trade
    ? onTrade(resource.trade)
    : onUpdate({key: resource.key, value: increment})

  console.log(getResourceTurnUpdate())
  return (
    <button onClick={onButtonClick}>
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginRight: 16}}>
        <img src={resource.icon} alt={resource.label} width={32} height={32}/>
        <span style={{fontSize: '0.7rem'}}>{resource.label}</span>
      </div>
      <div style={{marginRight: 8}}>
      {resource.value}
      </div>
      {resource.trade.give?.map(give => (
        <div key={'give' + give.key} style={{marginLeft: 6}}>
          <img src={give.icon} alt={give.label} width={16} height={16}/>
          <div style={{opacity: 0.4}}>{give.value}</div>
        </div>
      ))}
    </button>
  )
}

const GameControl = () => {
  const {current, isActive, start, stop} = useGame().tick;
  return (
    <StylesGameControl>
      <span>Turn {current}</span>
      <button onClick={isActive ? stop : start}>{isActive ? 'x' : '>'}</button>
    </StylesGameControl>
  )
}

const StylesGameControl = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    min-height: 40px;
    top: 20px;
    right: 20px;
    gap: 8px;
`;
