import {observer} from "mobx-react";
import {game} from "@/Game";
import {DotsVerticalCircle} from "@mynaui/icons-react";
import {AdminPanel} from "./AdminPanel.tsx";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/GameEngine/components";
import {DebugginOverlay, DebugginOverlayProps} from "@/GameEngine/Admin/Debugging/DebugginOverlay.tsx";

export type ResourceAdminProps = {
  buttonPosition?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
} & DebugginOverlayProps

export const ResourceAdmin = observer((
  {
    buttonPosition = 'top-right',
    customComponents,
  }
  : ResourceAdminProps) => {
  const {show_admin_panel} = game().admin;

  return (
    <div style={{position: 'absolute', top: 0, left: 0, height: "100vh", width: "100vw", pointerEvents: "none"}}>
      <div style={{pointerEvents: "initial"}}>
        {show_admin_panel && <AdminPanel/>}
        <ToggleButton buttonPosition={buttonPosition}/>
      </div>
      <DebugginOverlay customComponents={customComponents}/>
    </div>
  )
})

const ToggleButton = observer(({buttonPosition}: ResourceAdminProps) => {
  const {
    show_context_menu,
    onOpenAdminPanel,
    onOpenDebugPanel,
  } = game().admin;
  if (!show_context_menu) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="fixed z-[9000]"
            style={positions[buttonPosition!]}
          >
            <DotsVerticalCircle className="w-6 h-6"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onOpenAdminPanel}>
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenDebugPanel}>
              Debugging/Sandbox
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

})

const positions = {
  "top-left": {
    top: 20,
    left: 20
  },
  "top-right": {
    top: 20,
    right: 20
  },
  "bottom-left": {
    bottom: 20,
    left: 20
  },
  "bottom-right": {
    bottom: 20,
    right: 20
  },
}
