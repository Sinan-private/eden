import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {useState} from "react";
import {ResourceBase} from "../Resource";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";

export const AdminPanel = () => {
  const {
    check,
    getType,
  } = useGame().resources;
  return (
    <Container>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {getType("base_resource").map(({key}) => (
            <Resource key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("processed_resource").map(({key}) => (
            <Resource key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("build_resource").map(({key}) => (
            <Resource key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("citizen_resource").map(({key}) => (
            <Resource key={key} resource={check(key)}/>
          ))}
        </div>
      </div>
    </Container>
  )
}

const Resource = ({resource}: { resource: ResourceBase<ResourceKeys, ResourceTypes> }) => {
  const [value, setValue] = useState<number>(resource.value)
  const {
    resources: {
      onSetTo,
      mergeChangeToState
    },
    writeInitialResources
  } = useGame();

  const updateValue = () => {
    const newState = mergeChangeToState({...resource.store, value})
    onSetTo({key: resource.key, value})
    writeInitialResources(newState)
  }

  return (
    <div style={{display: 'flex'}}>
      <div style={{width: 100}}>
        <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginRight: 16}}>
          <img src={resource.icon} alt={resource.label} width={32} height={32}/>
          <span style={{fontSize: '0.7rem'}}>{resource.label}</span>
        </div>
        <div style={{marginRight: 8}}>
          {resource.value}
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={updateValue}
      />
    </div>
  )
}

const Container = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    min-width: 40vw;
    height: 100vh;
    overflow: auto;
    background-color: #2b2b2b;
    box-shadow: 10px 0 74px 0 #22183887;
`