import {useState} from "react";
import styled from "styled-components";
import {Debug_Behemoth} from "./Debug_Behemoth.tsx";
import {Debug_SlaveManagement} from "./Debug_SlaveManagement.tsx";
import {BEAUTIFY_DEBUG, DEBUG} from "../constants/constants.ts";
import {Label, Switch} from "@/components/ui";

export const DebuggingComponents = () => {
  const [beautifyValues, setBeautifyValues] = useState(BEAUTIFY_DEBUG)
  const [show, setShow] = useState(DEBUG)
  const onSwitch = () => setBeautifyValues(!beautifyValues)

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5000] p-4">
      <div className="relative pointer-events-auto z-[1000] w-[200] max-w-[20%] flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Switch id="debug-mode" checked={show} onCheckedChange={() => setShow(!show)}/>
          <Label htmlFor="debug-mode">Debug</Label>
        </div>
        {show &&
          <div className="flex items-center space-x-2">
            <Switch id="beautify" onCheckedChange={onSwitch} checked={beautifyValues}/>
            <Label htmlFor="beautify">Beautify values</Label>
          </div>
        }
      </div>
      {show &&
        <Child>
          <Debug_Behemoth beautifyValues={beautifyValues}/>
          <Debug_SlaveManagement beautifyValues={beautifyValues}/>
        </Child>
      }
    </div>
  )
}

const Child = styled.div`
    pointer-events: initial;
    z-index: 1000;
    padding: 30px 100px;
    height: calc(100% - 60px);
    overflow: auto;
`
