import {observer} from "mobx-react";
import {DotsVerticalCircle} from "@mynaui/icons-react";
import {AdminPanel} from "./AdminPanel.tsx";
import {Button, Separator, Switch} from "@/components/ui";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/Popover.tsx";
import {DebuggingComponents} from "@/test_eden/debug/custom/DebuggingComponents.tsx";
import {DebugginOverlay} from "@/Resource/Admin/Debugging/DebugginOverlay.tsx";
import {game} from "@/test_eden/Classes/Game";

export type ResourceAdminProps = {
  buttonPosition?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
}

export const ResourceAdmin = observer(({buttonPosition = 'top-right'}: ResourceAdminProps) => {
  const {showAdminPanel} = game().admin;

  return (
    <div style={{position: 'absolute', top: 0, left: 0, height: "100vh", width: "100vw", pointerEvents: "none"}}>
      <div style={{pointerEvents: "initial"}}>
        {showAdminPanel && <AdminPanel/>}
        <ToggleButton buttonPosition={buttonPosition}/>
      </div>
      <DebugginOverlay customComponents={[{label: 'Slave actions', component: (<DebuggingComponents />)}]} />
    </div>
  )
})

const ToggleButton = observer(({buttonPosition}: ResourceAdminProps) => {
  const {
    showAdminPanel,
    showDebugPanel,
    showDebugPanelBeautifiedValues,
    onToggleAdminPanel,
    onToggleDebugPanel,
    onToggleDebugPanelBeautifiedValues
  } = game().admin;

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
              <Switch checked={showDebugPanel} onCheckedChange={onToggleDebugPanel}/>
              <p>Debug</p>
            </div>
            <div className="flex items-center gap-4 pl-2">
              <Switch
                disabled={!showDebugPanel}
                checked={showDebugPanelBeautifiedValues}
                onCheckedChange={onToggleDebugPanelBeautifiedValues}
              />
              Beautify values
            </div>
            <Separator className="my-4"/>
            <p className="mb-1 text-muted-foreground">Admin</p>
            <div className="flex items-center gap-4">
              <Switch checked={showAdminPanel} onCheckedChange={onToggleAdminPanel}/>
              Admin Panel
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
