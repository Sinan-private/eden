import {useGame} from "./context/game.context.ts";
import {Update} from "./context/types.ts";

export const Game = () => {
  const {
    get,
    // onBakeBread,
    // onBuildField,
    // onBuildWindmill,
    // onBuildBakery,
    currentTick,
    // resources,
    startGlobalTick,
    pauseGlobalTick,
    isTicking,
    state,
  } = useGame();

  // const onBakeBread = () => onTrade(convertResources.bread())
  return (
    <>

      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>

        <div className="card">
          {state.filter(({type}) => type === "base_resource").map(({key}) => (
            <Button key={key} resource={get(key)}/>
          ))}
        </div>

        <div className="card">
          {state.filter(({type}) => type === "processed_resource").map(({key}) => (
            <Button key={key} resource={get(key)}/>
          ))}
        </div>

        <div className="card">
          {state.filter(({type}) => type === "build_resource").map(({key}) => (
            <Button key={key} resource={get(key)}/>
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
  resource: Update;
  increment?: number;
  // onClick?(): void;
}

const Button = ({resource, increment = 1}: ButtonProps) => {
  const {onUpdate, onTrade, check} = useGame();
  const _resource = check(resource.key)

  const onButtonClick = () => _resource.has_trade
    ? onTrade(_resource.trade)
    : onUpdate({key: resource.key, value: increment})

  return (
    <button onClick={onButtonClick}>
      {resource.label} {resource.value}
    </button>
  )
}