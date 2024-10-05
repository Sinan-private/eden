import {useGame} from "./context/game.context.ts";
import {ResourceUpdateProps} from "./Resource/types.ts";
import {ResourceKeys, ResourceTypes} from "./gameRules/types.ts";
type Update = ResourceUpdateProps<ResourceKeys, ResourceTypes>;

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

  const tradeIfPossible = (
    give: Update[],
    gain: Update[],
    amount = 1
  ) => {
    if (trade(give, gain, amount).isPartlyPossible) {
      onTrade(give, gain, amount)
    }
  }
  const onBakeBread = () => tradeIfPossible(
    [{key: 'flour', value: 1}, {key: 'water', value: 2}],
    [{key: 'bread', value: 1}],
    get('bakery').value
  )

  const onBuildField = () => tradeIfPossible(
    [{key: 'land', value: 1}, {key: 'gold', value: 10}],
    [{key: 'field', value: 1}]
  )

  const onBuildWell = () => tradeIfPossible(
    [{key: 'land', value: 1}, {key: 'gold', value: 20}],
    [{key: 'well', value: 1}]
  )

  const onBuildWindmill = () => tradeIfPossible(
    [{key: 'land', value: 1}, {key: 'gold', value: 50}],
    [{key: 'windmill', value: 1}]
  )

  const onMakeFlour = () => tradeIfPossible(
    [{key: 'corn', value: 2}],
    [{key: 'flour', value: 1}]
  )

  const onBuildBakery = () => tradeIfPossible(
    [{key: 'land', value: 1}, {key: 'gold', value: 50}],
    [{key: 'bakery', value: 1}]
  )
  // console.log(state, get('corn'))
  return (
    <>

    <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>

      <div className="card">
      {state.filter(({type}) => type === "base_resource").map(({key}) => (
        <Button key={key} resource={get(key)}/>
      ))}
      </div>

      <div className="card">
        <Button resource={get('bread')} onClick={onBakeBread}/>
        <Button resource={get('flour')} onClick={onMakeFlour}/>

      </div>

      <div className="card">
        <Button resource={get('land')}/>
        <Button resource={get('windmill')} onClick={onBuildWindmill}/>
        <Button resource={get('bakery')} onClick={onBuildBakery}/>
        <Button resource={get('well')} onClick={onBuildWell}/>
        <Button resource={get('field')} onClick={onBuildField}/>
      </div>
    </div>
      <div>
        Turn {currentTick}
        <button onClick={isTicking ? pauseGlobalTick : startGlobalTick}>{isTicking ? 'x' : '>'}</button>
      </div>
    </>
  )
}

type ButonProps = {
  resource: Update;
  increment?: number;
  onClick?(): void;
}

const Button = ({resource, increment = 1, onClick}: ButonProps) => {
  const {onUpdate} = useGame();
  const onButtonClick = () => onClick
    ? onClick()
    : onUpdate({key: resource.key, value: increment})
  return (
    <button onClick={onButtonClick}>
      {resource.label} {resource.value}
    </button>
  )
}