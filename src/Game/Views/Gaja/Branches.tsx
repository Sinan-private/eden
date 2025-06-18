import {useMemo} from "react";
import {observer} from "mobx-react";
import {game, useTickSubscription} from "@/Game";
import {Branch} from "@/Game/Views/Gaja/Branch.ts";
import {createSingletonBranches} from "@/Game/Views/Gaja/createSingletonBranches.ts";

// const branchClass = new BranchClass(7)
// const branchClass = new BranchManager(7)

export const Branches = observer(({displacement}: { displacement: number }) => {
  const {climb_speed, climb_height} = game().behemoth;
  // const branchClass = useRef<BranchManager>(new BranchManager(climb_height.value)).current;
  const branchClass = createSingletonBranches().getInstance(climb_height.value)

  useTickSubscription(() => {
    if (climb_speed.value) {
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


    const getPositionXX = (index: number) => {
      const {x, y} = branchClass.branchPosition(index)
      return `translate(${x}px, ${y}px)`
    }
    // console.log(displacement, branchClass._height)

    return (
      <>
        <div className="fixed top-[300px] right-0 z-[1000]">
          {branchClass.ordered_branches.map(branch => (
            <p key={branch.id}>
              {branch.new_y?.toFixed()}
            </p>
          ))}
        </div>
        {branchClass.branches.map((branch, i) => (
          <BranchRender
            key={i}
            branch={branch}
            position={getPositionXX(i)}
          />
        ))}
      </>
    )

  }, [branchClass, displacement])
  return (branchViews)
})

type BranchProps = {
  branch: Branch;
  position: string;
}

const BranchRender = (
  {
    branch: {image, z, y, new_y},
    position
  }: BranchProps
) => {
  return (
    <div className={`
    absolute top-0 z-[-1] object-contain h-[400px]
    w-[800px] right-[350px]
    xl:w-[640px] xl:right-[500px]
    lg:w-[560px] lg:right-[500px]
    md:w-[480px] md:right-[400px]
    `}
         style={{
           transform: position,
           zIndex: -1 - z,
         }}
    >
      <div className="relative border border-gray-200 rounded-lg top-1/2 w-1/3 h-10 -translate-y-1/2">

        {new_y?.toFixed()} | {y?.toFixed()}
      </div>
      <img
        src={image}
        style={{filter: `blur(${z * 1.5}px) brightness(${1 - z / 10}) hue-rotate(${z * 10}deg)`,}}

        alt={image}
      />
    </div>
  )
}
