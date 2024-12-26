import {AdminPanel} from "./AdminPanel.tsx";
import {useAdmin} from "../context/admin.context.ts";
import styled from "styled-components";

type ResourceAdminProps = {
  buttonPosition?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
}

export const ResourceAdmin = ({buttonPosition = 'top-right'}: ResourceAdminProps) => {
  const {showAdminPanel} = useAdmin()

  return (
    <div style={{height: "100vh", width: "100vw", pointerEvents: "none"}}>
      <div style={{pointerEvents: "initial"}}>
        {showAdminPanel && <AdminPanel/>}
        <ToggleButton buttonPosition={buttonPosition} />
      </div>
    </div>
  )
}

const ToggleButton = ({buttonPosition}: ResourceAdminProps) => {
  const {onToggleAdminPanel} = useAdmin()

  return (
    <StylesGameControl style={positions[buttonPosition!]}>
      <button onClick={onToggleAdminPanel}>Admin</button>
    </StylesGameControl>
  )
}

const positions = {
  "top-left": {
    top: 20,
    left: 20
  },
  "top-right": {
    top: 20,
    right: 20
  },
  "bottom-left": {
    bottom: 20,
    left: 20
  },
  "bottom-right": {
    bottom: 20,
    right: 20
  },
}

const StylesGameControl = styled.div`
    position: fixed;
    display: flex;
    min-height: 40px;

    div {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
