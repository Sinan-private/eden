import {resourceTypes} from "../Resource/generated/resourceTypes.ts";
import {ResourceTypes} from "../Resource/types.ts";
import {useGame} from "../context/game.context.ts";

export const HandleTypes = () => {
  const {writeRemoveType} = useGame();
  return (
    <>
      HandleTypes
      {resourceTypes.map((resourceType: ResourceTypes) => (
        <button key={resourceType} onClick={() => writeRemoveType(resourceType)}>
          {resourceType}
        </button>
      ))}
    </>
  )
}