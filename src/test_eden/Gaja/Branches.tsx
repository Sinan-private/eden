import {useMemo, useRef} from "react";
import {observer} from "mobx-react";
import {BranchClass, BranchState} from "./BranchClass.ts";
import {game} from "@/test_eden/Classes/Game";
import {useTurnSubscription} from "@/GameController/Resource/hooks/useSubscription.ts";

// const WIDTH = 800;

export const Branches = observer(({displacement}: { displacement: number }) => {
  const branchClass = useRef<BranchClass>(new BranchClass(7)).current
  const {climb_speed} = game().behemoth;
  useTurnSubscription(() => {
    if (climb_speed.value) {
      branchClass?.turnUpdate(displacement)
    }
  })

  const branchViews = useMemo(() => {
  if (!branchClass) {
    return null
  }
  const getPosition = (x: number, i: number) =>
    `translate(${x}px, ${branchClass.getPosition(i, displacement)}px)`

    return (
      <>
        {branchClass.branches.map((branch, i) => (
          <Branch
            key={i}
            branch={branch}
            position={getPosition(branch.x, i)}
          />
        ))}
      </>
    )

  }, [branchClass, displacement])
  return (branchViews)
})

type BranchProps = {
  branch: BranchState;
  position: string;
}

const Branch = ({
  branch: {image, z},
  position
}: BranchProps) => (
  <img
    src={image}
    className={`
    absolute top-0 z-[-1] object-contain h-[400px]
    w-[800px] right-[350px]
    xl:w-[640px] xl:right-[500px]
    lg:w-[560px] lg:right-[500px]
    md:w-[480px] md:right-[400px]
    `}
    style={{
      filter: `blur(${z*1.5}px) brightness(${1 - z / 10}) hue-rotate(${z*10}deg)`,
      transform: position,
      zIndex: -1 - z,
    }}
    alt={image}
  />
)
