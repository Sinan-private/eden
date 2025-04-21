import React, {useMemo} from "react";
import {observer} from "mobx-react";
import {X} from "@mynaui/icons-react";
import {DebuggingResources} from "@/GameController/Resource/Admin/Debugging/DebuggingResources.tsx";
import {Button} from "@/GameController/components/ui";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/GameController/components/ui/tabs.tsx";
import {game} from "@/test_eden/Classes/Game";

type DebugginOverlayProps = {
  customComponents?: {label: string, component: React.ReactNode}[]
}

export const DebugginOverlay = observer(({customComponents}: DebugginOverlayProps) => {
  const {
    showDebugPanel,
    onToggleDebugPanel
  } = game().admin;
  const toRender = useMemo(() => {
    if (!showDebugPanel) {
      return null
    }
    if (!customComponents?.length) {
      return (<DebuggingResources />)
    }
    const list = customComponents
      .concat({label: 'default', component: (<DebuggingResources />)})
      .reverse()
    return (
      <Tabs defaultValue="default" className="pointer-events-auto fixed top-2 left-2">
        <TabsList>
          {list.map(({label}) => (
            <TabsTrigger key={label} value={label}>{label}</TabsTrigger>
          ))}
        </TabsList>
        <div className="px-8">
          {list.map(({label, component}) => (
          <TabsContent key={label} value={label}>{component}</TabsContent>
          ))}
        </div>
      </Tabs>
    )
  }, [customComponents, showDebugPanel])

  if (!showDebugPanel) {
    return null
  }

  return (
    <div className="fixed top-10 left-0 w-screen h-screen pointer-events-none z-[5000] p-4 overflow-y-auto">
      {toRender}
      <Button className="fixed top-2 right-2 pointer-events-auto" variant="outline" onClick={onToggleDebugPanel} style={{zIndex: 100}}>
        <X/>
      </Button>
    </div>
  )
})
