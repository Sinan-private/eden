import {Tunnel} from "@/Game/Gaja/Digging/Tunnel.tsx";
import {game} from "@/Game/Classes/Game";

export const Digging = () => {
  const {behemoth} = game()
  if (behemoth.is_moving) {
    return null
  }

  return (
    <div className="absolute left-8 top-1/2 w-full -translate-y-1/2 z-1">
      <Tunnel />
    </div>
  )
}
