import {observer} from "mobx-react";
import {Timer} from "./Timer.ts";
import {useTest} from "./test.context.ts";

export const TimerView = () => {
  const timer = useTest().timer
  return (
    <>
    <Test timer={timer} />
    <ResourceTest />
    </>
  )
}

const ResourceTest = observer(() => {
  const {resources, corn} = useTest()
  const cornNested = resources.get('corn');
  const onClickCorn = () => {
    corn?.updateValueBy(20)
  }

  return (
    <>
      <p>Corn single: {corn.value}</p>
      <button onClick={onClickCorn}>increment</button>
  <p>corn: {corn?.value}</p>
  <button onClick={() => cornNested?.updateValueBy(20)}>raise</button>
</>
)
})

const Test = observer(({timer}: {timer: Timer}) => (
  <>
  <span>Seconds passed: {timer.secondsPassed}</span>
    <button onClick={() => timer.increaseTimer()}>increment</button>
  </>
))

// setInterval(() => {
//   myTimer.increaseTimer()
// }, 1000)