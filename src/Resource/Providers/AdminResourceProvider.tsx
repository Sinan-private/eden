import React from "react";
import {TickProvider} from "../context/tick.context.ts";
import {ResourceAdmin, ResourceAdminProps} from "@/Resource/Admin/ResourceAdmin.tsx";

export type ResourceProviderProps = {
  children: React.ReactNode;
  initialState: {
    admin?: ResourceAdminProps;
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