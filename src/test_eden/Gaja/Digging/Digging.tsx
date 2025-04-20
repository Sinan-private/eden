import {Tunnel} from "@/test_eden/Gaja/Digging/Tunnel.tsx";
import {game} from "@/test_eden/Classes/Game";

export const Digging = () => {
  const {behemoth} = game()
  const {digging_depth} = behemoth
  if (behemoth.is_moving) {
    return null
  }

  return (
    <div className="absolute left-8 top-1/2 w-full -translate-y-1/2 z-1">
      <Tunnel $digging_depth={digging_depth.state.value} />
    </div>
  )
}
