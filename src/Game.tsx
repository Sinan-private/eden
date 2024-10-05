import {useGame} from "./context/game.context.ts";
import {Resource} from "./gameRules/Resource.ts";

export const Game = () => {
  const {
    currentTick,
    check,
    startGlobalTick,
    pauseGlobalTick,
    isTicking,
    state,
  } = useGame();

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
        Turn {currentTick}
        <button onClick={isTicking ? pauseGlobalTick : startGlobalTick}>{isTicking ? 'x' : '>'}</button>
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
      {resource.label} {resource.value}
    </button>
  )
}
