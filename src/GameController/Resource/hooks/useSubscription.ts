import {useEffect, useRef} from "react";
import {game} from "@/Game/Classes/Game";
import {id} from "@/GameController/Resource/helpers/id.ts";

export const useTickSubscription = (
  callback: (tick: number) => void,
  _id?: string
) => {
  useSubscription(callback, 'tick', _id);
}

export const useTurnSubscription = (
  callback: (tick: number) => void,
  _id?: string
) => {
  useSubscription(callback, 'turn', _id,);
}

const useSubscription = (
  callback: (tick: number) => void,
  interval: 'tick' | 'turn' = 'tick',
  _id = id()
) => {
  const { subscribeToTick, subscribeToTurn } = game().tick;
  const callbackRef = useRef(callback);

  // Keep ref in sync
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const subscription = interval === 'tick' ? subscribeToTick : subscribeToTurn;
    const unsubscribe = subscription((tick) => {
      callbackRef.current(tick);
    }, _id);

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
