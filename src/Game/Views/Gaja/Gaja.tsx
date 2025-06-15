import {ReactNode} from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {Branches} from "./Branches.tsx";
import {Digging} from "./Digging/Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";
import image from '../../../assets/images/seemless_trunk.png';
import {useComponentMount} from "@/GameEngine/ResourceEngine/hooks";
import {Mushroom} from "@/Game/Views/Gaja/RenderEngine.ts";
import cloud_image from '../../../assets/images/clouds1.png'


// Stamm erweitern
// - Pilze am Stamm
// - Lichtadern (Mana)
// - Nebelschwaden im Vordergrund


const BACKGROUND_IMAGE_HEIGHT = 600;
const BACKGROUND_IMAGE_WIDTH = 571;

export const Gaja = observer(() => {
  const {renderEngine} = game()
  const {getByKey} = game().resources
  const climb_height = getByKey('behemoth_climb_height').value
  const trunkDisplacement = climb_height - BACKGROUND_IMAGE_HEIGHT * 3
  const prop = (trunkDisplacement % BACKGROUND_IMAGE_HEIGHT) - BACKGROUND_IMAGE_HEIGHT
  useComponentMount(() => {
    renderEngine.add(new Mushroom({
      type: 'cloud',
      x: 200,
      y: 100,
      z: 0,
      image: cloud_image,
      width: 400,
      height: 100,
    }))
  })

  const visibleElement = renderEngine.getElements()[0];
  console.log(visibleElement)

  return (
    <Tree>
      <Trunk displacement={prop}/>
      <Branches displacement={climb_height}/>
      <Behemoth/>
      <Digging/>
      { visibleElement &&
        <img id="test-image" src={visibleElement.image} className={visibleElement.className}/>
      }
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
