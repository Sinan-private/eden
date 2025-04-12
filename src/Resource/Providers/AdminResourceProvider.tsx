import React from "react";
import {AdminProvider} from "../Admin2";
import {TickProvider} from "../context/tick.context.ts";
import {ResourceAdmin, ResourceAdminProps} from "../Admin2/ResourceAdmin.tsx";
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
      <AdminProvider initialState={initialState.resourceStore}>
        {children}
        <ResourceAdmin buttonPosition={initialState?.admin?.buttonPosition}/>
      </AdminProvider>
    </TickProvider>
  )
}