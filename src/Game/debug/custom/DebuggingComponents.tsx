import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";
import {Debug_Earth} from "@/Game/debug/custom/Debug_Earth.tsx";

export const DebuggingComponents = () => (
  <>
    <div className="relative pointer-events-auto z-[1000] w-[200] max-w-[20%] flex flex-col gap-2">
    </div>
    <div className="flex flex-wrap gap-2 overflow-y-auto h-full">
      <Debug_Behemoth/>
      <Debug_SlaveManagement/>
      <Debug_Earth/>
    </div>
  </>
)
