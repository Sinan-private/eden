import {observer} from "mobx-react";
import {game} from "@/Game";
import {DotsVerticalCircle} from "@mynaui/icons-react";
import {AdminPanel} from "./AdminPanel.tsx";
import {
  Button,
  Label,
  Separator,
  Switch,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/GameController/components";
import {DebugginOverlay, DebugginOverlayProps} from "@/GameController/Resource/Admin/Debugging/DebugginOverlay.tsx";

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
    show_admin_panel,
    show_debug_panel,
    show_debug_panel_beautified_values,
    onToggleAdminPanel,
    onToggleDebugPanel,
    onToggleDebugPanelBeautifiedValues,
    show_context_menu,
  } = game().admin;
  if (!show_context_menu) {
    return null
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="fixed z-[9000]"
            style={positions[buttonPosition!]}
          >
            <DotsVerticalCircle className="w-6 h-6"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-black/80">
          <div className="flex flex-col py-4 gap-2">
            <p className="mb-1 text-muted-foreground">Debug resources</p>
            <div className="flex items-center gap-4">
              <Switch id="show-debug-panel" checked={show_debug_panel} onCheckedChange={onToggleDebugPanel}/>
              <Label htmlFor="show-debug-panel">Debug</Label>
            </div>
            <div className="flex items-center gap-4 pl-2">
              <Switch
                id="show-debug-beautify"
                disabled={!show_debug_panel}
                checked={show_debug_panel_beautified_values}
                onCheckedChange={onToggleDebugPanelBeautifiedValues}
              />
              <Label htmlFor="show-debug-beautify">Beautify values</Label>

            </div>
            <Separator className="my-4"/>
            <p className="mb-1 text-muted-foreground">Admin</p>
            <div className="flex items-center gap-4">
              <Switch id="show-admin-panel" checked={show_admin_panel} onCheckedChange={onToggleAdminPanel}/>
              <Label htmlFor="show-admin-panel">Admin Panel</Label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
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
