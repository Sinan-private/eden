import icons from "../../assets/icons/icons.ts";
import {Icon, ResourceState} from "../../ResourceHandler/genericTypes.ts";

export const useIcons = <K extends string, T extends string>(state: ResourceState<K, T>[]) => {
  const __getUsedIcons = () => state.map(({iconName}) => iconName);
  const getByKey = (key: K): Icon => icons.find(({name}) => name === key)!
  const getBySrc = (src: string): Icon => icons.find(icon => icon.src === src)!
  const getUsed = () => {
    const used = __getUsedIcons();
    return icons.filter(({name}) => used.includes(name))
  }
  const getUnused = () => {
    const used = __getUsedIcons();
    return icons.filter(({name}) => !used.includes(name))
  }

  const getAll = () => icons

  return {
    getByKey,
    getUsed,
    getUnused,
    getAll,
    getBySrc
  }
}