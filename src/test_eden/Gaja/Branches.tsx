import styled from "styled-components";
import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {useMemo, useRef} from "react";
import {useTurnSubscription} from "../../Resource";
import {BranchClass} from "./BranchClass.ts";



export const Branches = observer(({displacement}: { displacement: number }) => {
  const branchClass = useRef<BranchClass>(new BranchClass(7)).current
  const {climb_speed} = useGame().behemoth;
  useTurnSubscription(() => {
    if (climb_speed.value) {
      branchClass?.turnUpdate(displacement)
    }
  })

  const branchViews = useMemo(() => {
  if (!branchClass) {
    return null
  }
    return (
      <>
        {branchClass.branches.map(({image, z, x}, i) => (
          <Branch
            key={i}
            src={image}
            style={{
              filter: `blur(${z*1.5}px) brightness(${1 - z / 10}) hue-rotate(${z*10}deg)`,
              transform: `translate(${x}px, ${branchClass.getPosition(i, displacement)}px)`,
              zIndex: -1 - z,
            }}
          />
        ))}
      </>
    )

  }, [branchClass, displacement])
  return (branchViews)
})
const Branch = styled('img')`
    position: absolute;
    top: 0;
    right: 400px;
    width: 800px;
    height: 400px;
    object-fit: contain;
    z-index: -1;
`