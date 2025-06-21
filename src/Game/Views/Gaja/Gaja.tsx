import {ReactNode} from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {Digging} from "./Digging/Digging.tsx";
import {Behemoth} from "./Behemoth.tsx";
import image from '../../../assets/images/seemless_trunk.png';
import {useComponentMount} from "@/GameEngine/ResourceEngine/hooks";
import {Factory as RenderFactory} from "@/Game/RenderEngine/Factory.ts";
import {Branch} from "@/Game/RenderEngine/Renderable.ts";
import {BACKGROUND_IMAGE_WIDTH} from "@/Game/RenderEngine/media_queries.ts";


// Stamm erweitern
// - Pilze am Stamm
// - Lichtadern (Mana)
// - Nebelschwaden im Vordergrund


const BACKGROUND_IMAGE_HEIGHT = 600;

export const Gaja = observer(() => {
  const {renderEngine} = game()
  const {getByKey} = game().resources
  const climb_height = getByKey('behemoth_climb_height').value
  const trunkDisplacement = climb_height - BACKGROUND_IMAGE_HEIGHT * 3
  const prop = (trunkDisplacement % BACKGROUND_IMAGE_HEIGHT) - BACKGROUND_IMAGE_HEIGHT
  useComponentMount(() => {
    // renderEngine.add(new Cloud({
    //   type: 'cloud',
    //   offset_x: 800,
    //   offset_y: -100,
    //   z: 10,
    //   image: 'cloud1'
    // }))
    // renderEngine.add(new Branch({
    //   type: 'branch',
    //   offset_x: -700,
    //   offset_y: 0,
    //   z: -8,
    //   image: 'branch3',
    //   sticky: true,
    // }))
    // renderEngine.addFactory(new RenderFactory(BranchForeground, {initial_amount: 5}))
    // renderEngine.addFactory(new RenderFactory(Cloud, {
    //   initial_amount: 5,
    //   random_x: [-400, 800],
    // }))
    // renderEngine.add(new Branch({z: -9, image: 'branch1', type: 'branch', offset_x: -700}))
    renderEngine.addFactory(new RenderFactory(Branch, {
      initial_amount: 3,
      image_type: 'branch',
      z: [-1, -8],
      x: -700,
      spawn: {
        edge: 'top',
        anchor: {
          target: 'gaja',
          side: 'left'
        }
      }
    //   Searching for anchor here
    }))
    // renderEngine.addFactory(new RenderFactory(Branch, {
    //   initial_amount: 3,
    //   image_type: 'test',
    //   z: 0,
    //   offset_x: 0,
    // }))
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
          {/*<p className="relative top-[-250px] right-[-100px]">{element.y.toFixed()}</p>*/}
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

const Tree = ({children}: { children: ReactNode }) => {
  const {xl, lg, md} = BACKGROUND_IMAGE_WIDTH
  return (
    <div className={`
  fixed top-0 right-0 w-[171px] h-screen z-1
  xl:w-[${xl}px] lg:w-[${lg}px] md:w-[${md}px]
  `}>
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


const old = {
  initial_amount: 3,
  image_type: 'branch',
  z: [0, -8],
  offset_x: -700,
  spawn: {
    edge: 'top',
    anchor: {
      target: 'gaja',
      side: 'left'
    }
  }
}

type SpawnEdge = 'top' | 'bottom' | 'left' | 'right' | 'center';

const factoryProps = {
  initial_amount: 3,
  image_type: 'branch',
  z: [0, -8],
  x: [5, 95],
  y: 0,
  anchor: 'gaja',
  spawn: {
    from: 'top',
    min_distance: 200,
    chance: 30,
  }
}
