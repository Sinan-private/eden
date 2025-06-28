import {observer} from "mobx-react";
import {game} from "@/Game";
import background from '../../assets/images/hell_background.jpg'

export const Background = observer(() => {
  const {danger} = game().upstream
  const distort = danger;
  const distortionStrength = distort / 100;
  const hueRotation = distort * 1.95;
  const brightness = 1-distortionStrength/3
  const bloodPosition = 200 - distort * 2
  const saturate = 1 + distortionStrength / 2

  return (
    <>
      <div
        id="Game Frame"
        className="fixed top-0 left-0 w-screen h-screen z-1 bg-cover"
        style={{
          filter: `brightness(${brightness}) hue-rotate(${hueRotation}deg) blur(${distort/5}px) saturate(${saturate})`,
          backgroundImage: `url(${background})`
      }}/>

      <div
        id="Danger_Blood"
        className="absolute pointer-events-none bottom-0 left-0 w-full h-1/2 bg-red-500 mix-blend-color blur-[110px] z-1"
        style={{transform: `translateY(${bloodPosition}%)`, opacity: 0.5 + distortionStrength, zIndex: 1}}
      />
    </>
  )
})
