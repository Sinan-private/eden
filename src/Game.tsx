import {useGame} from "./context/game.context.ts";
import {TradeUpdate, Update} from "./context/types.ts";

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
    convertResources,
  } = useGame();

  const tradeIfPossible = (
    {
      give,
      gain,
      multiplier = 1
    }: TradeUpdate
  ) => {
    if (trade(give, gain, multiplier).isPartlyPossible) {
      onTrade(give, gain, multiplier)
    }
  }
  const onBakeBread = () => tradeIfPossible(convertResources.bread())

  const onBuildField = () => tradeIfPossible(convertResources.field())

  const onBuildWell = () => tradeIfPossible(convertResources.well())

  const onBuildWindmill = () => tradeIfPossible(convertResources.windmill())

  const onMakeFlour = () => tradeIfPossible(convertResources.flour())

  const onBuildBakery = () => tradeIfPossible(convertResources.bakery())
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

type ButtonProps = {
  resource: Update;
  increment?: number;
  onClick?(): void;
}

const Button = ({resource, increment = 1, onClick}: ButtonProps) => {
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