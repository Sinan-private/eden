import {ReactNode, useState} from "react";
import {observer} from "mobx-react";
import {useTickSubscription} from "@/GameController";
import {game} from "@/Game";
import {Branches} from "./Branches.tsx";
import {Digging} from "./Digging/Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";
import {CLIMBING_SPEED_COEFFICIENT} from "../../../GameController/Resource/constants.ts";
import image from '../../../assets/images/seemless_trunk.png';

const BACKGROUND_IMAGE_HEIGHT = 600;
const BACKGROUND_IMAGE_WIDTH = 571;

export const Gaja = observer(() => {
  const {getByKey} = game().resources
  const [displacement, setDisplacement] = useState(0);

  useTickSubscription(() => {
    const climbing_speed = getByKey('behemoth_climb_speed').value
    if (climbing_speed) {
      const newPosition = (displacement + climbing_speed * CLIMBING_SPEED_COEFFICIENT)
      setDisplacement(() => newPosition)
    }
  })
  const trunkDisplacement = displacement - BACKGROUND_IMAGE_HEIGHT * 3
  const prop = (trunkDisplacement % BACKGROUND_IMAGE_HEIGHT) - BACKGROUND_IMAGE_HEIGHT

  return (
    <Tree>
      <Trunk displacement={prop}/>
      <Branches displacement={displacement}/>
      <Behemoth/>
      <Digging/>
    </Tree>
  )
})

const Tree = ({children}: { children: ReactNode }) => (
  <div className="
  fixed top-0 right-0 w-[171px] h-screen z-1
  xl:w-[571px] lg:w-[457px] md:w-[343px]
  ">
    {children}
  </div>
)


const Trunk = ({displacement}: { displacement: number }) => {
  return (
    <div className="relative w-full h-[600px]">
      <div className={`w-[${BACKGROUND_IMAGE_WIDTH}px] h-[3000px]`}
           style={{transform: `translateY(${displacement}px)`, backgroundImage: `url(${image})`}}/>
    </div>
  )
}
