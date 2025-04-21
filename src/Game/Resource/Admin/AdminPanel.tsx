import styled from "styled-components";
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
      <StyledContainer id="Admin Panel BG">
        <div className="absolute" style={{top: 10, right: 10}}>
          <Button variant="outline" onClick={onCloseAdminPanel} style={{zIndex: 100}}>
            <X/>
          </Button>

        </div>

        <Content>
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
        </Content>

      </StyledContainer>
    </>
  )
}

const StyledContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    min-width: 60vw;
    background-color: #09090b;
    //box-shadow: 10px 0 74px 0 #22183887;
    z-index: 1000;
`
const Content = styled.div`
    height: 100vh;
    overflow: auto;

`