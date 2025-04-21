import {Button} from "@/Game/components/ui/button.tsx";
import {X} from "@mynaui/icons-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Game/components/ui/tabs.tsx";
import {AdminResourceOverview} from "@/Game/Resource/Admin/Resource/AdminResourceOverview.tsx";
import {AdminType} from "@/Game/Resource/Admin/AdminType.tsx";
import {game} from "@/test_eden/Classes/Game";

export const AdminPanel = () => {
  const {onCloseAdminPanel} = game().admin;

  return (
    <>
      <div id="Admin Panel BG" className="fixed left-0 top-0 min-w-screen/60 bg-black z-[1000]">
        <div className="absolute" style={{top: 10, right: 10}}>
          <Button variant="outline" onClick={onCloseAdminPanel} style={{zIndex: 100}}>
            <X/>
          </Button>

        </div>

        <div className="h-screen overflow-y-auto">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
            </TabsList>
            <div className="px-8">
              <TabsContent value="resources"><AdminResourceOverview /></TabsContent>
              <TabsContent value="types"><AdminType /></TabsContent>
            </div>
          </Tabs>
        </div>

      </div>
    </>
  )
}
