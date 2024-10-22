import styled from "styled-components";
import {useGame} from "../context/game.context.ts";
import {EditResource} from "./EditResource.tsx";
import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {AddResource} from "./AddResource.tsx";

export const AdminPanel = () => {
  const {
    get,
    getByType,
  } = useGame().resources;

  const [loading, setLoading] = useState(true);
  const [openNewResource, setOpenNewResource] = useState(true);

  const handleCloseAddCost = () => {
    setOpenNewResource(false);
  };

  useEffect(() => {
    // Measure when the browser has finished rendering
    const handleRenderingComplete = () => {
      // Rendering is done, stop the spinner
      setLoading(false);
    };

    // `requestAnimationFrame` queues up the task after rendering is done
    requestAnimationFrame(() => {
      // The first frame after the render is complete
      handleRenderingComplete();
    });
  }, []);
  console.log(loading)

  return (
    <StyledContainer>
      <AddResource open={openNewResource} onClose={handleCloseAddCost} />
      <Typography variant="h2" align="left" sx={{ml: 4}}>Starting Resources</Typography>
      <div style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
        <div className="card">
          {getByType("base_resource").map(({key}) => (
            <EditResource key={key} resource={get(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getByType("processed_resource").map(({key}) => (
            <EditResource key={key} resource={get(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getByType("build_resource").map(({key}) => (
            <EditResource key={key} resource={get(key)}/>
          ))}
          <hr style={{color: 'gray', margin: '20px 0'}}/>
          {getByType("citizen_resource").map(({key}) => (
            <EditResource key={key} resource={get(key)}/>
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
    z-index: 1000;
`
