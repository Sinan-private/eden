import {useMemo, useRef} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {BranchClass} from "./BranchClass.ts";
import {game} from "@/test_eden/Classes/Game";
import {useTurnSubscription} from "@/Resource/hooks/useTickSubscription.ts";

const WIDTH = 800;

export const Branches = observer(({displacement}: { displacement: number }) => {
  const branchClass = useRef<BranchClass>(new BranchClass(7)).current
  const {climb_speed} = game().behemoth;
  useTurnSubscription(() => {
    if (climb_speed.value) {
      branchClass?.turnUpdate(displacement)
    }
  })
  // useTurnSubscription(() => {
  //   if (climb_speed.value) {
  //     branchClass?.turnUpdate(displacement)
  //   }
  // })

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
    right: ${WIDTH * 0.5}px;
    width: ${WIDTH}px;
    height: 400px;
    object-fit: contain;
    z-index: -1;
    @media only screen and (max-width: 1200px) {
        right: ${WIDTH * 0.5}px;
        width: ${WIDTH * 0.8}px;
    }
    @media only screen and (max-width: 992px) {
        right: ${WIDTH * 0.4}px;
        width: ${WIDTH * 0.7}px;
    }
    @media only screen and (max-width: 768px) {
        right: ${WIDTH * 0.3}px;
        width: ${WIDTH * 0.6}px;
    }
`