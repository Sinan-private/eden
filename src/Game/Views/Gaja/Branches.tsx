import {useMemo} from "react";
import {observer} from "mobx-react";
import {game, useTurnSubscription} from "@/Game";
import {BranchState} from "./BranchClass.ts";
import {BranchManager} from "@/Game/Views/Gaja/BranchManager.ts";
import {Branch} from "@/Game/Views/Gaja/Branch.ts";

// const branchClass = new BranchClass(7)
const branchClass = new BranchManager(7)

export const Branches = observer(({displacement}: { displacement: number }) => {
  // const branchClass = useRef<BranchClass>(new BranchClass(7)).current
  const {climb_speed, climb_height} = game().behemoth;

  useTurnSubscription(() => {
    if (climb_speed.value) {
      branchClass?.turnUpdate(displacement)
      branchClass.subscription(climb_height.value)
    }
  })
  // console.log(branchClass2.branches[0])

  const branchViews = useMemo(() => {
  if (!branchClass) {
    return null
  }
  // const getPosition = (x: number, i: number) =>
  //   `translate(${x}px, ${branchClass.getPosition(i, displacement)}px)`

    const getPosition = (branch: Branch) => {
    const {x, y} = branch.getPosition(displacement)
    return  `translate(${x}px, ${y}px)`
    }

    const getPositionXX = (index: number) => {
      const {x, y} = branchClass.branchPosition(index)
      return `translate(${x}px, ${y}px)`
    }
  console.log(displacement, branchClass._height)

    return (
      <>
        {branchClass.branches.map((branch, i) => (
          <BranchRender
            key={i}
            branch={branch}
            position={getPosition(branch)}
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

const BranchRender = ({
  branch: {image, z},
  position
}: BranchProps) => {
  return (
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
}
