import {ResourceRawProvider} from "../context/resource.context.ts";
import {AdminProvider} from "../Admin";
import {Child} from "../Child.tsx";
import React from "react";
import {TickProvider} from "../context/tick.context.ts";
import {ResourceAdmin, ResourceAdminProps} from "../Admin/ResourceAdmin.tsx";

export type ResourceProviderProps = {
  children: React.ReactNode;
  initialState?: {
    admin: ResourceAdminProps
  };
}

export const AdminResourceProvider = ({children, initialState}: ResourceProviderProps) => {

  return (
    <ResourceRawProvider>
      <TickProvider>
        <AdminProvider>
          <Child>
            {children}
            <ResourceAdmin buttonPosition={initialState?.admin?.buttonPosition} />
          </Child>
        </AdminProvider>
      </TickProvider>
    </ResourceRawProvider>
  )
}