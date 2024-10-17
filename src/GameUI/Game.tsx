import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {ResourceClass} from "../gameRules/types.ts";
import {TopBar} from "./TopBar.tsx";

export const Game = () => {
  const {
    check,
    getType,
  } = useGame().resources;

  return (
    <>
      <TopBar/>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {getType("base_resource").map(({key}) => (
            <Button key={key} resource={check(key)} increment={10}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("processed_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
        </div>
        <div className="card">
          {getType("build_resource").map(({key}) => (
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
    // getResourceTurnUpdate,
  resources: {
    onUpdate, onTrade
  }} = useGame();
  const onButtonClick = () => resource.__cost
    ? onTrade(resource.__cost)
    : onUpdate({key: resource.key, value: increment})

  // console.log(getResourceTurnUpdate())
  // console.log(checkTrade)
  return (
    <button onClick={onButtonClick}>
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginRight: 16}}>
        <img src={resource.icon} alt={resource.label} width={32} height={32}/>
        <span style={{fontSize: '0.7rem'}}>{resource.label}</span>
      </div>
      <div style={{marginRight: 8}}>
      {resource.value}
      </div>
      {resource.cost?.give.map(give => (
        <div key={'give' + give.key} style={{marginLeft: 6}}>
          <img src={give.icon} alt={give.key} width={16} height={16}/>
          <div style={{opacity: 0.4}}>{give.value}</div>
        </div>
      ))}
    </button>
  )
}

const GameControl = () => {
  const {
    writeInitialResources,
    tick: {
    current, isActive, start, stop
  }} = useGame();
  const writeUpdate = () => writeInitialResources()
  return (
    <StylesGameControl>
      <div>
        <span>Turn {current}</span>
        <button onClick={isActive ? stop : start}>{isActive ? 'x' : '>'}</button>
      </div>
      <button onClick={writeUpdate}>Save</button>
    </StylesGameControl>
  )
}

const StylesGameControl = styled.div`
    position: fixed;
    display: flex;
    min-height: 40px;
    top: 20px;
    right: 20px;
    div {
        display: flex;
    align-items: center;
        gap: 8px;
    }
`;
