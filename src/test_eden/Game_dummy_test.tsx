import {observer} from "mobx-react";
import styled from "styled-components";
import {TopBar} from "./TopBar.tsx";
import {useResource, useTickSubscription, ResourceClass, TickSubscription} from "../Resource";
import {useState} from "react";
import {Stack} from "@mui/material";

const phases = [
  '',
  'climbing',
  'drilling',
  'mana_liquefaction',
  'mana_drying',
  'mana_harvest',
  'mana_cleaning',
] as const

type Phase = typeof phases[number];

export const Game_dummy_test = () => {
  const {resources} = useResource();
  const {groupByType, getByType} = resources;
  const [phase, setPhase] = useState<Phase>('')

  const resourceGroups = groupByType();
  const resourceTurnUpdate: TickSubscription = () => {
    switch (phase) {
      case 'climbing':
        resources.get('behemoth_hight').updateValueBy(10);
        break;
      case 'drilling':
        resources.get('drill_depth').updateValueBy(10);
        break;
      case 'mana_liquefaction':
        resources.get('liquid_mana_level_1').updateValueBy(resources.get('drill_depth').value);
        resources.get('liquid_mana_level_2').updateValueBy(resources.get('drill_depth').value / 20);
        resources.get('liquid_mana_level_3').updateValueBy(resources.get('drill_depth').value / 300);
        resources.get('liquid_mana_level_4').updateValueBy(resources.get('drill_depth').value / 4000);
        resources.get('liquid_mana_level_5').updateValueBy(resources.get('drill_depth').value / 50000);
        break;
      case 'mana_drying':
        resources.produce('dirty_mana_level_1');
        resources.produce('dirty_mana_level_2');
        resources.produce('dirty_mana_level_3');
        resources.produce('dirty_mana_level_4');
        resources.produce('dirty_mana_level_5');
        break;
      case 'mana_harvest':
        resources.produce('raw_mana_level_1');
        resources.produce('raw_mana_level_2');
        resources.produce('raw_mana_level_3');
        resources.produce('raw_mana_level_4');
        resources.produce('raw_mana_level_5');
        break;
      case 'mana_cleaning':
        resources.produce('clean_mana_level_1');
        resources.produce('clean_mana_level_2');
        resources.produce('clean_mana_level_3');
        resources.produce('clean_mana_level_4');
        resources.produce('clean_mana_level_5');
        break;
    }
    // resources.produce('raw_mana_level_1');
  }

  useTickSubscription(resourceTurnUpdate);
  return (
    <>
      <TopBar/>
      <div>
        <Stack direction="row" spacing={2} justifyContent="center">

          {phases.filter(Boolean).map(p => (
            <button style={{background: phase !== p ? 'transparent' : ''}} key={p} onClick={() => setPhase(p)}>
              {p}
            </button>
          ))}
        </Stack>
      </div>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        {resourceGroups.map(({type, resources}) => (
          <div className="card" key={type}>
            <ResourceGroup resources={resources}/>
          </div>
        ))}
      </div>
      <GameControl/>
    </>
  )
}

const TradeButton = ({resource, increment = 1}: ButtonProps) => {
  const {produce} = useResource().resources;
  const onButtonClick = () => {
    produce(resource.key, increment)
  }

  return <ResourceButton resource={resource} onClick={onButtonClick}/>
}

const ResourceGroup = ({resources}: { resources: ResourceClass[] }) => {

  return (
    <>
      {resources.map((resource) => (
        <Button key={resource.key} resource={resource} increment={10}/>
      ))}
    </>
  )
}

type ButtonProps = {
  resource: ResourceClass;
  increment?: number;
}
const Button = ({resource, increment = 1}: ButtonProps) => {

  const onButtonClick = () =>
    resource.updateValueBy(increment)

  return <ResourceButton resource={resource} onClick={onButtonClick}/>
}

const ResourceButton = observer(({resource, onClick}: { resource: ResourceClass; onClick(): void }) => (
  <button onClick={onClick}>
    <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginRight: 16}}>
      <img src={resource.icon} alt={resource.label} width={32} height={32}/>
      <span style={{fontSize: '0.7rem'}}>{resource.label}</span>
    </div>
    <div style={{marginRight: 8}}>
      {resource.beautify.value}
    </div>
    {resource.cost?.give.map(give => (
      <div key={'give' + give.key} style={{marginLeft: 6}}>
        <div style={{opacity: 0.4}}>{give.value}</div>
      </div>
    ))}
  </button>
))

const GameControl = () => {
  const {
    current,
    isActive,
    start,
    stop,
  } = useTickSubscription();
  return (
    <StylesGameControl>
      <div>
        <span>Turn {current}</span>
        <button onClick={isActive ? stop : start}>{isActive ? 'x' : '>'}</button>
      </div>
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
