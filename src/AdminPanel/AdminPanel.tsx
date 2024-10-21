import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {EditResource} from "./EditResource.tsx";
import {Typography} from "@mui/material";

export const AdminPanel = () => {
  const {
    check,
    getType,
  } = useGame().resources;

  return (
    <StyledContainer>
      <Typography variant="h2" align="left" sx={{ml: 4}}>Starting Resources</Typography>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {getType("base_resource").map(({key}) => (
            <EditResource key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("processed_resource").map(({key}) => (
            <EditResource key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("build_resource").map(({key}) => (
            <EditResource key={key} resource={check(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getType("citizen_resource").map(({key}) => (
            <EditResource key={key} resource={check(key)}/>
          ))}
        </div>
      </div>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    min-width: 60vw;
    height: 100vh;
    overflow: auto;
    background-color: #2b2b2b;
    box-shadow: 10px 0 74px 0 #22183887;
`
