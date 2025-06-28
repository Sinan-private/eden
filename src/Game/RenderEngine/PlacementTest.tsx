import {Placement} from "@/Game/RenderEngine/Placement.ts";

export const PlacementTest = () => {
  const imageWidth = 100;
  const imageHeight = 100;
  const parentWidth = 400;
  const parentheight = 400;
  const x = new Placement({
    x: 20,
    y: 100,
    z: 1,
    width: imageWidth,
    height: imageHeight,
    anchor: {w: parentWidth, h: parentheight}
  });

  return (
    <div className="flex flex-wrap fixed w-[400px] h-[400px] top-32 left-1/2">
      <div className="w-1/2 h-1/2 border border-red-500"></div>
      <div className="w-1/2 h-1/2 border border-red-500"></div>
      <div className="w-1/2 h-1/2 border border-red-500"></div>
      <div className="w-1/2 h-1/2 border border-red-500"></div>
      <div
        className="w-[100px] h-[100px] border border-blue-50 absolute"
        style={x.position_outside_viewport}
      />
    </div>
  )
}