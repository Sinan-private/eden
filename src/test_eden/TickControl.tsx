import {useTurnSubscription} from "../Resource";
import styled from "styled-components";

export const TickControl = () => {
  const {
    isActive,
    start,
    stop,
    currentTurn
  } = useTurnSubscription();
  return (
    <StylesGameControl>
      <div>
        <span>Turn {currentTurn}</span>
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