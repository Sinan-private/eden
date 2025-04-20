import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";
import {Debug_Earth} from "@/Resource/Admin/Debugging/custom/Debug_Earth.tsx";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {observer} from "mobx-react";

export const DebuggingComponents = observer(() => {
  const {
    showDebugPanel,
    showDebugPanelBeautifiedValues,
  } = AdminController.getInstance();

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5000] p-4">
      <div className="relative pointer-events-auto z-[1000] w-[200] max-w-[20%] flex flex-col gap-2">
      </div>
      {showDebugPanel &&
        <div className="flex flex-wrap gap-2 overflow-y-auto h-full">
          <Debug_Behemoth beautifyValues={showDebugPanelBeautifiedValues}/>
          <Debug_SlaveManagement beautifyValues={showDebugPanelBeautifiedValues}/>
          <Debug_Earth beautifyValues={showDebugPanelBeautifiedValues}/>
        </div>
      }
    </div>
  )
})
