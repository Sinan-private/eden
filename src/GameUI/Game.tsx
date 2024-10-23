import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {TopBar} from "./TopBar.tsx";
import {Resource} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../Resource/types.ts";

export const Game = () => {
  const {
    get,
    getByType,
  } = useGame().resources;

  return (
    <>
      <TopBar/>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {getByType("base_resource").map(({key}) => (
            <Button key={key} resource={get(key)} increment={10}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getByType("processed_resource").map(({key}) => (
            <Button key={key} resource={get(key)}/>
          ))}
        </div>
        <div className="card">
          {getByType("build_resource").map(({key}) => (
            <Button key={key} resource={get(key)}/>
          ))}
        </div>
      </div>
      <GameControl/>
    </>
  )
}

type ButtonProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  increment?: number;
}

const Button = ({resource, increment = 1}: ButtonProps) => {
  const {
    // getResourceTurnUpdate,
  resources: {
    onUpdate,
    onTrade,
    get
  }} = useGame();
  const onButtonClick = () => resource.cost
    ? onTrade(resource.cost)
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
          <img src={get(give.key).icon} alt={give.key} width={16} height={16}/>
          <div style={{opacity: 0.4}}>{give.value}</div>
        </div>
      ))}
    </button>
  )
}

const GameControl = () => {
  const {
    // writeInitialResources,
    setShowAdminPanel,
    showAdminPanel,
    tick: {
    current, isActive, start, stop
  }} = useGame();
  // const writeUpdate = () => writeInitialResources()
  return (
    <StylesGameControl>
      <div>
        <span>Turn {current}</span>
        <button onClick={isActive ? stop : start}>{isActive ? 'x' : '>'}</button>
      </div>
      <button onClick={() => setShowAdminPanel(!showAdminPanel)}>Admin</button>
      {/*<button onClick={writeUpdate}>Save</button>*/}
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
