import {useGame} from "./context/game.context.ts";
import {TradeUpdate, Update} from "./context/types.ts";
import {ResourceConversion} from "./gameRules/ResourceConversion.ts";

export const Game = () => {
  const {
    get,
    onTrade,
    trade,
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
          {state.filter(({type}) => type === "build").map(({key}) => (
            <Button key={key} resource={get(key)}/>
          ))}
          <Button resource={get('land')}/>
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
  const {onUpdate, convertResources, onTrade} = useGame();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const onButtonClick = () => convertResources[resource.key]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
    ? onTrade(convertResources[resource.key]())
    : onUpdate({key: resource.key, value: increment})

  return (
    <button onClick={onButtonClick}>
      {resource.label} {resource.value}
    </button>
  )
}