import {ReactNode} from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {Digging} from "./Digging/Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";
import image from '../../../assets/images/seemless_trunk.png';
import {useComponentMount} from "@/GameEngine/ResourceEngine/hooks";
import {BACKGROUND_IMAGE_WIDTH} from "@/Game/RenderEngine/media_queries.ts";
import {ImageProvider} from "@/Game/RenderEngine/ImageProvider.ts";
import {Branch, Cloud, ManaVein, Mushroom} from "@/Game/RenderEngine/RenderableElements.ts";
import {RenderFactoryConfigProps} from "@/Game/RenderEngine/types.ts";

const BACKGROUND_IMAGE_HEIGHT = 600;

export const Gaja = observer(() => {
  const {renderEngine} = game()
  const {getByKey} = game().resources
  const climb_height = getByKey('behemoth_climb_height').value
  const trunkDisplacement = climb_height - BACKGROUND_IMAGE_HEIGHT * 3
  const prop = (trunkDisplacement % BACKGROUND_IMAGE_HEIGHT) - BACKGROUND_IMAGE_HEIGHT
  useComponentMount(() => {
    // renderEngine.add(new Branch({z: -9, image: 'branch1', type: 'branch', offset_x: -700}))
    renderEngine.addFactory(branchConfig, Branch)
    renderEngine.addFactory(cloudConfig, Cloud)
    renderEngine.addFactory(manaVeinConfig, ManaVein)
    renderEngine.addFactory(mushroomConfig, Mushroom)
  })

  const elements = renderEngine.getElements()

  return (
    <Tree>
      <Trunk displacement={renderEngine.trunk_position}/>
      {/*<Branches displacement={climb_height}/>*/}
      <Behemoth/>
      <Digging/>
      {elements.map(element => (
        <div
          id={'Branch' + element.id}
          key={element.id}
          className={element.className}
          style={{
            ...element.style
          }}
        >
          <img src={element.image} alt=""/>
          {/*<p className="relative top-[-250px] right-[-100px]">{element.y.toFixed()}</p>*/}
        </div>
      ))}
    </Tree>
  )
})

const Tree = ({children}: { children: ReactNode }) => {
  const {w} = ImageProvider.getGajaSize
  return (
    <div id="Tree" className={`
  fixed top-0 right-0 h-screen z-1
  `}
         style={{width: w}}
    >
      {children}
    </div>
  )
}

const Trunk = ({displacement}: { displacement: number }) => {
  return (
    <div className="relative w-full h-[600px]">
      <div className={`w-[${BACKGROUND_IMAGE_WIDTH.xl}px] h-[3000px]`}
           style={{transform: `translateY(${displacement}px)`, backgroundImage: `url(${image})`}}/>
    </div>
  )
}

const branchConfig: RenderFactoryConfigProps = {
  initial_amount: 3,
  spawn_min_distance: 100,
  spawn_chance: 10,
  spawn_amount: [0, 6],
  type: 'branch',
  z: [-1, -9],
  x: 1,
  anchor: "gaja",
}
const cloudConfig: RenderFactoryConfigProps = {
  initial_amount: 5,
  spawn_min_distance: 100,
  spawn_chance: 10,
  type: 'cloud',
  z: [3, 8],
  x: [0, 100],
}
const manaVeinConfig: RenderFactoryConfigProps = {
  initial_amount: 2,
  spawn_min_distance: 400,
  type: 'mana_vein',
  anchor: 'gaja',
  z: 0,
  x: [30, 90],
  spawn_chance: 20,
}
const mushroomConfig: RenderFactoryConfigProps = {
  initial_amount: 2,
  spawn_min_distance: 100,
  type: 'mushroom',
  anchor: 'gaja',
  z: 0,
  x: [30, 90],
  spawn_chance: 20,
}