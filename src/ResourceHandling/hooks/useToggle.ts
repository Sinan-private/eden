import {useState} from "react";

export const useToggle = (defaultState = false): [boolean, () => void] => {
  const [state, setState] = useState(defaultState);
  const toggle = () => setState(!state);

  return [state, toggle]
}
