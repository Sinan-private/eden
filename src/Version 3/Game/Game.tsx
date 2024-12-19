import {observer} from "mobx-react";
import styled from "styled-components";
import {useGame} from "../../context/game.context.ts";
import {TopBar} from "../../GameUI/TopBar.tsx";
import {Resource} from "../Resource/Single";
import {ResourceKeys, ResourceTypes} from "../../Resource/specificTypes.ts";


export const Game = () => {
  const {groupByType, getByType} = useGame().resources;
  const resourceGroups = groupByType();
  const x = getByType('processed_resource');

  return (
    <>
      <TopBar/>
          <div >
            {x.map(resource => (
                <TradeButton key={resource.key} resource={resource} increment={1}/>
            ))}
          </div>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        {resourceGroups.map(group => (
          <div className="card" key={group[0].type}>
            <ResourceGroup resources={group} />
          </div>
        ))}
      </div>
      <GameControl/>
    </>
  )
}

const TradeButton = observer(({resource, increment = 1}: ButtonProps) => {
  const {produce} = useGame().resources;
  const onButtonClick = () => {
    // console.log('me', resource.key)
    // resource.updateValueBy(5)
    produce(resource.key, increment)
  }
  // console.log(resource.id, resource.label)

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
          <div style={{opacity: 0.4}}>{give.value}</div>
        </div>
      ))}
    </button>
  )
})

const ResourceGroup = ({resources}: { resources: Resource<ResourceKeys, ResourceTypes>[] }) => {

  return (
    <>
      {resources.map((resource) => (
        <Button key={resource.key} resource={resource} increment={10}/>
      ))}
    </>
  )
}

type ButtonProps = {
  resource: Resource<ResourceKeys, ResourceTypes>;
  increment?: number;
}
const Button = observer(({resource, increment = 1}: ButtonProps) => {

  const onButtonClick = () => {
    resource.updateValueBy(increment)
  }

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
          <div style={{opacity: 0.4}}>{give.value}</div>
        </div>
      ))}
    </button>
  )
})

const GameControl = () => {
  const {
    // writeInitialResources,
    onToggleAdminPanel,
    tick: {
      current,
      isActive,
      start,
      stop,
    }
  } = useGame();
  return (
    <StylesGameControl>
      <div>
        <span>Turn {current}</span>
        <button onClick={isActive ? stop : start}>{isActive ? 'x' : '>'}</button>
      </div>
      <button onClick={onToggleAdminPanel}>Admin</button>
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
