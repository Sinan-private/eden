import {Box, LinearProgress, Stack} from "@mui/material";
import {useGame} from "../context/game.context.ts";
import styled from "styled-components";

export const FactionManager = () => {
  const factions = useGame().factions;
  const all = Object.values(factions);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2}}>
      {all.map(({image, visible, active, loyalty, influence, progress, setActive}) => (
        <Box key={image} sx={{display: visible ? 'block' : 'none'}}>
          <Box sx={{position: 'relative', width: 70, height: 70}}>
            <img
              onClick={setActive}
              src={image}
              alt={image}
              style={{width: '100%', height: '100%', filter: active ? '' : 'saturate(0) brightness(0.2) contrast(0.8)'}}
            />
            {active &&
              <VerticalProgress value={progress.value} />
            }
          </Box>
          <Stack color="gray" width={70}>
            <LinearProgress variant="determinate" value={active ? loyalty.value : 0} color={active ? "warning" : "inherit"}/>
            <LinearProgress variant="determinate" value={active ? influence.value : 0} color={active ? "error" : "inherit"}/>
          </Stack>
        </Box>
      ))}
    </Box>
  )
}

const VerticalProgress = ({value = 50}: {value?: number}) => {
  const absolute = {position: 'absolute', bottom: 0, right: 0}
  return (
    <Box id="custom progress" sx={{width: 4, height: '100%', background: '#ffffff21', ...absolute}}>
      <VerticalBar $height={value} />
      {/*<Box sx={{width: '100%', height: value + '%', backgroundColor: 'white', ...absolute}} />*/}
    </Box>
  )
}

const VerticalBar = styled.div.attrs<{ $height: number }>(props => ({
  style: {
    height: props.$height + '%'
  }
}))`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: white;
`
