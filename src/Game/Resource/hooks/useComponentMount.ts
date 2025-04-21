import {useEffect, useRef} from "react";

export const useComponentMount = (callback: () => any) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
