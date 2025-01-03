import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import {useMemo} from "react";
import {Box} from "@mui/material";
import mana_dirty from "../../Resource/assets/icons/mana_dirty.png";
import styled from "styled-components";

const SPOTS_DIVIDER = 25;

export const Digging = observer(() => {
  const {behemoth} = useGame()
  const {digging_depth, flushing_depth, dirty_mana} = behemoth
  const spots = useMemo(() => {
    const amount = Math.floor(dirty_mana / SPOTS_DIVIDER);
    const spotList = Array.from(Array(amount).keys()).map(key => {
      const index = key % 100;
      const [x, y, size] = randomCoordinates[index];
      return [key, x, y, size]
    })
    return (
      <Box sx={{position: 'relative', zIndex: 10000}}>
        {spotList.map(([i, x, y, size]) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: 20 * size,
            height: 20 * size,
            top: y,
            left: x,
            borderRadius: 20,
            // background: 'radial-gradient(circle, rgba(34,54,50,1) 0%, rgba(47,71,66,1) 100%)',
          }}>
            <img src={mana_dirty} alt="dirty mana found" width={32 * size / 3} style={{opacity: 0.7}}/>
          </Box>
        ))}
      </Box>
    )
  }, [dirty_mana])

  return (
    <Box sx={{
      position: 'absolute',
      left: 0,
      top: '50%',
      width: '100%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    }}>
      <Box sx={{
        position: 'absolute',
        width: 200,
        height: 200,
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
      }}>
        {spots}
      </Box>

      <Tunnel $digging_depth={digging_depth.state.value}>

        <Acid $flushing_depth={flushing_depth.state.value}/>
      </Tunnel>

    </Box>
  )
})
const getRandomCoordinates = (max: number) => {
  const rand = (divider = 2) => {
    const multiplier = Math.random() > 0.5 ? 1 : -1;
    return (max / 2) + Math.random() * (max / divider) * multiplier;
  }
  return [rand(), rand(4), Math.random() * 3 + 0.5];
}
const getRandomCoordinateList = (max: number) => {
  return Array.from(Array(max).keys()).map(() => {
    const [x, y, size] = getRandomCoordinates(max);
    return [x, y, size]
  })
}
const randomCoordinates = getRandomCoordinateList(200);

const Tunnel = styled.div.attrs<{ $digging_depth: number }>(props => ({
  style: {
    width: props.$digging_depth + '%',
  },
}))`position: relative;
    height: 50px;
    background-Color: #000000b3;
    transition: width 0.3s linear`

const Acid = styled.div.attrs<{ $flushing_depth: number }>(props => ({
  style: {
    height: props.$flushing_depth + '%'
  },
}))`position: absolute;
    left: 0;
    bottom: 0;
    background-color: green;
    width: 100%;`
