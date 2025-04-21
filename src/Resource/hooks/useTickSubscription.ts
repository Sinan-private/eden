import {useEffect, useRef} from "react";
import {game} from "@/test_eden/Classes/Game";
import {id} from "@/Resource/helpers/id.ts";


export const useTickSubscription = (
  callback: (tick: number) => void,
  _id = id()
) => {
  const { subscribe } = game().tick;
  const hasRun = useRef(false);

  // Always have the latest callback
  // const callbackRef = useRef(callback);
  // useEffect(() => {
  //   callbackRef.current = callback;
  // }, [callback]);
  //
  // // Stable function for Set
  // const stableHandlerRef = useRef<(tick: number) => void>();
  // if (!stableHandlerRef.current) {
  //   stableHandlerRef.current = (tick) => {
  //     callbackRef.current(tick);
  //   };
  // }

  useEffect(() => {
    console.log(_id)
    if (!hasRun.current) {
    console.log(id(), _id)
    const unsubscribe = subscribe(callback);
    return () => {
      unsubscribe();
    };
    }
  }, []);
};
