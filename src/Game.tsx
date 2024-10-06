import {useGame} from "./context/game.context.ts";
import {Resource} from "./gameRules/Resource.ts";

export const Game = () => {
  const {
    check,
    tick,
    state,
  } = useGame();
  const {current, isActive, start, stop} = tick;

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
  resource: Resource;
  increment?: number;
}

const Button = ({resource, increment = 1}: ButtonProps) => {
  const {onUpdate, onTrade} = useGame();
  const onButtonClick = () => resource.has_trade
    ? onTrade(resource.trade)
    : onUpdate({key: resource.key, value: increment})

  return (
    <button onClick={onButtonClick}>
      <img src={resource.icon} style={{marginRight: 8}} />
      {resource.label} {resource.value}
    </button>
  )
}
