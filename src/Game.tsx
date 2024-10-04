import {useGame} from "./context/game.context.ts";
import {ResourceKeys} from "./context/gameInit.ts";
import {ResourceState} from "./NEW_Resource/types.ts";
import {ResourceUpdateProps} from "./Resource/types.ts";

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
    // state,
  } = useGame();

  const tradeIfPossible = (
    give: ResourceUpdateProps<ResourceKeys>[],
    gain: ResourceUpdateProps<ResourceKeys>[],
    amount = 1
  ) => {
    console.log(trade)
    if (trade(give, gain, amount).isPartlyPossible) {
      onTrade(give, gain, amount)
      // setState(trade.newState)
    }
  }
  const onBakeBread = () => tradeIfPossible(
    [{key: 'corn', value: 1}, {key: 'water', value: 2}, {key: 'gold', value: 1}],
    [{key: 'bread', value: 1}],
    get('bakery').value
  )

  const onBuildField = () => tradeIfPossible(
    [{key: 'land', value: 1}, {key: 'gold', value: 10}],
    [{key: 'field', value: 1}]
  )
  // console.log(state, get('corn'))
  return (
    <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>

      <div className="card">
        <Button resource={get('stone')}/>
        <Button resource={get('corn')}/>
        <Button resource={get('water')}/>
        <Button resource={get('bread')} onClick={onBakeBread}/>


      </div>
      <div className="card">
        <Button resource={get('gold')} increment={25}/>
        <Button resource={get('land')}/>
        <Button resource={get('field')} onClick={onBuildField}/>
        {/*<Button resource={resources.get('windmill')} onClick={onBuildWindmill} />*/}
        {/*<Button resource={resources.get('bakery')} onClick={onBuildBakery} />*/}
      </div>
      <div>
        Turn {currentTick}
        <button onClick={isTicking ? pauseGlobalTick : startGlobalTick}>{isTicking ? 'x' : '>'}</button>
      </div>
    </div>
  )
}

type ButonProps = {
  resource: ResourceState<ResourceKeys>;
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
      {resource.label} is {resource.value}
    </button>
  )
}