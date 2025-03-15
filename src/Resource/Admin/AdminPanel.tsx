import {useEffect, useState} from "react";
import styled from "styled-components";
import {AdminResources} from "./Resource/new/AdminResourcesNew.tsx";
import {HandleTypes} from "./Resource/HandleTypes.tsx";
import {useAdmin} from "../context/admin.context.ts";
import {X} from "@mynaui/icons-react";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";

export const AdminPanel = () => {
  const {onCloseAdminPanel} = useAdmin();

  const [, setLoading] = useState(true);

  useEffect(() => {
    const handleRenderingComplete = () => {
      setLoading(false);
    };

    requestAnimationFrame(() => {
      handleRenderingComplete();
    });
  }, []);

  return (
    <StyledContainer>
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
            <TabsContent value="resources"><AdminResources/></TabsContent>
            <TabsContent value="types"><HandleTypes/></TabsContent>
          </div>
        </Tabs>
      </Content>

    </StyledContainer>
  )
}

const StyledContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    min-width: 60vw;
    background: linear-gradient(180deg, rgb(53, 57, 70) 0%, rgba(35, 42, 60, 1) 100%);
    box-shadow: 10px 0 74px 0 #22183887;
    z-index: 1000;
`
const Content = styled.div`
    height: 100vh;
    overflow: auto;

`