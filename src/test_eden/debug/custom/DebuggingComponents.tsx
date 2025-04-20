import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";
import {Debug_Earth} from "@/test_eden/debug/custom/Debug_Earth.tsx";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {observer} from "mobx-react";

export const DebuggingComponents = observer(() => {
  const {
    showDebugPanelBeautifiedValues,
  } = AdminController.getInstance();

  return (
    <>
      <div className="relative pointer-events-auto z-[1000] w-[200] max-w-[20%] flex flex-col gap-2">
      </div>
        <div className="flex flex-wrap gap-2 overflow-y-auto h-full">
          <Debug_Behemoth beautifyValues={showDebugPanelBeautifiedValues}/>
          <Debug_SlaveManagement beautifyValues={showDebugPanelBeautifiedValues}/>
          <Debug_Earth beautifyValues={showDebugPanelBeautifiedValues}/>
        </div>
    </>
  )
})
