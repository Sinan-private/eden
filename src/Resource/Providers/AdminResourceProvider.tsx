import React from "react";
import {TickProvider} from "../context/tick.context.ts";
import {ResourceAdmin, ResourceAdminProps} from "@/Resource/Admin/ResourceAdmin.tsx";
import {ResourceStoreClass} from "@/Resource";

export type ResourceProviderProps = {
  children: React.ReactNode;
  initialState: {
    admin?: ResourceAdminProps;
    resourceStore: ResourceStoreClass
  };
}

export const AdminResourceProvider = ({children, initialState}: ResourceProviderProps) => {

  return (
    <TickProvider>
        {children}
        <ResourceAdmin buttonPosition={initialState?.admin?.buttonPosition}/>
    </TickProvider>
  )
}