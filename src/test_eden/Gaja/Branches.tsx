import styled from "styled-components";
import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {MutableRefObject, useMemo, useRef, useState} from "react";
import {ResourceStoreClass, useTurnSubscription} from "../../Resource";
import {randomRange} from "../Classes/Slaves/helpers/randomRange.ts";
import branch_image1 from "../../assets/images/Branch3.png";
import branch_image2 from "../../assets/images/Branch4.png";
import branch_image3 from "../../assets/images/Branch5.png";
import branch_image7 from "../../assets/images/Branch7.png";
import {BranchClass} from "./BranchClass.ts";

type BranchState = {
  displacement: number;
  image: string;
  distance: number;
  x: number;
}

const branch_images = [
  branch_image1,
  branch_image2,
  branch_image3,
  branch_image7,
]
const randomBranchImage = () => branch_images[randomRange(0, branch_images.length - 1)]

const chanceForBranch = (branchAmount: number) => {
  // I want between 0 and 3 branches to exist at the same time
  // 3 - 0%  - 0%
  // 2 - 25% - 2%
  // 1 - 50% - 4%
  // 0 - 75% - 6%
  return (30 - branchAmount * 10) / 100
}

export const Branches = observer(({displacement}: { displacement: number }) => {
  const branchClass = useRef<BranchClass>(new BranchClass(3)).current
  const {climb_speed} = useGame().behemoth;
  const [branches, setBranches] = useState<BranchState[]>([]);
  useTurnSubscription(() => {
    if (climb_speed.value) {
      branchClass.turnUpdate(displacement)
      // const chanceForBranch = (30 - branches.length * 10) / 100
      const shouldCreate = branchClass._shouldCreateBranch(displacement)
      const createBranch = () => {
        const minDistanceToLastBranch = (branches[branches.length - 1]?.displacement || 0) - displacement < -200
        const isLucky = Math.random() < chanceForBranch(branches.length)
        return climb_speed.value
          ? isLucky && minDistanceToLastBranch
          : false;
      }
      const removePassedBranches = branches.filter(b => {
        console.log(b?.displacement - displacement)
        return b?.displacement - displacement > -3000
      })
      // console.log(removePassedBranches, createBranch())
      if (removePassedBranches?.length < branches.length) {
        setBranches(removePassedBranches)
      }
      if (shouldCreate) {
        console.log(randomBranchImage(), randomRange(0, 2))
        setBranches((current) => current.concat({
          displacement,
          image: randomBranchImage(),
          distance: randomRange(1, 5),
          x: randomRange(0, 300),
        }))
      }
    }
    // console.log('---')
    // console.log(branches)
    // console.log(branches[branches.length -1].displacement - displacement)
    // console.log('---')
  })

  const branchViews = useMemo(() => {
    console.log()
    const position = (i: number, distance: number) =>
      (displacement - branches[i].displacement) * (1 - distance / 10)
    return (
      <>
        {branches.map(({image, distance, x}, i) => (
          <Branch
            key={i}
            src={image}
            // $displacement={position(i) - 500}
            style={{
              filter: `blur(${distance}px) brightness(${1 - distance / 10})`,
              transform: `translate(${x}px, ${position(i, distance) - 500}px)`
            }}
          />
        ))}
      </>
    )
  }, [branches, displacement])
  // const position = (displacement - branches[0].displacement) * 0.8
  return (
    // <Branch src={branch_image} $displacement={position}/>
    <>
      {branchViews}
    </>
  )
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