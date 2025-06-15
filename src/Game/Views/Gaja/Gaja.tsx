import {ReactNode} from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {Digging} from "./Digging/Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";
import image from '../../../assets/images/seemless_trunk.png';
import {useComponentMount} from "@/GameEngine/ResourceEngine/hooks";
import {Cloud, Mushroom} from "@/Game/Views/Gaja/RenderEngine.ts";


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
    renderEngine.add(new Cloud({
      type: 'cloud',
      offset_x: 800,
      offset_y: -100,
      z: 10,
      image: 'cloud1'
    }))
    renderEngine.add(new Mushroom({
      type: 'branch',
      offset_x: -40,
      offset_y: 0,
      z: -1,
      image: 'branch3'
    }))
    // renderEngine.addFactory(new BranchFactory())
  })

  const elements = renderEngine.getElements()

  return (
    <Tree>
      <Trunk displacement={prop}/>
      {/*<Branches displacement={climb_height}/>*/}
      <Behemoth/>
      <Digging/>
      {elements.map(element => (
        <div
          key={element.id}
          className={element.className}
          style={{
            ...element.style
          }}
        >
          <img src={element.image} alt=""/>
          <p className="relative top-[-250px] right-[-100px]">{element.y.toFixed()}</p>
        </div>
      ))}
      {/*{elements.map(element => (*/}
      {/*  <img*/}
      {/*    key={element.id}*/}
      {/*    src={element.image}*/}
      {/*    className={element.className}*/}
      {/*    style={{*/}
      {/*      ...element.style*/}
      {/*    }}*/}
      {/*  />*/}
      {/*))}*/}
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
