import {useEffect} from "react";

export const useComponentMount = (callback: () => any) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
