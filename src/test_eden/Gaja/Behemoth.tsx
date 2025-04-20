import behemoth_animated from "../../assets/images/Behemoth_animated.gif";
import behemoth_image from "../../assets/images/Behemoth.png";
import {game} from "@/test_eden/Classes/Game";
import {observer} from "mobx-react";

export const Behemoth = observer(() => {
  const {resources, tick: {isActive}} = game();
  const {getByKey} = resources;
  const speed = getByKey('behemoth_climb_speed').value;
  const src = speed && isActive ? behemoth_animated : behemoth_image;
  return (
    <>

    <div
      id="Behemoth"
      className="absolute top-1/2 -left-5 w-10 h-[100px] z-10  flex flex-col justify-center items-center -translate-y-1/2 "
    >
      <img className="max-w-none w-[170px] -rotate-90" src={src} alt={src} />
    </div>
    </>
  )
})
