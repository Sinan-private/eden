import {observer} from "mobx-react";
import {game} from "@/Game";
import upstream_image from "@/assets/images/upstream.gif";

const IMAGE_HEIGHT = 400

export const Upstream = observer(() => {
  const {upstream, behemoth} = game();
  const position = IMAGE_HEIGHT - (behemoth.climb_height.value - upstream.height.value);
  return position < -300
    ? null
    : (
      <div id="Upstream" className="fixed pointer-events-none w-full h-[600px] left-0 z-[100]"
           style={{bottom: -400 + position}}>
        <div className="relative w-full h-[200px] left-0 z-1"
             style={{backgroundImage: `url(${upstream_image})`, backgroundPosition: '0 280px'}}/>
        <div className="w-full h-[400px] bg-black"/>
      </div>
    )
})
