import {useGame} from "./context/game.context.ts";
import {ResourceClass} from "./gameRules/types.ts";

export const Game = () => {
  const {
    resource,
    tick,
  } = useGame();
  const {current, isActive, start, stop} = tick;
  const {state, check} = resource

  return (
    <>

      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {state.filter(({type}) => type === "base_resource").map(({key}) => (
            <Button key={key} resource={check(key)}/>
          ))}
        </div>

        <div className="card">
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
