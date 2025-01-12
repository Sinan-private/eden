import {Box, Stack} from "@mui/material";
import {grey_blue} from "../../constants/colors.ts";
import behemoth_icon from '../../assets/images/behemoth_icon.png'
import factions_icon from '../../assets/images/factions.png'
import player_icon from '../../assets/images/Player_stats.png'
import {useGame} from "../context/game.context.ts";
import {InterfaceActiveLeft} from "./InterfaceController.ts";
import {observer} from "mobx-react";

const BUTTON_SIZE = 50;
const IMAGE_SIZE = BUTTON_SIZE * 0.8


export const FooterButtons = () => {
  return (
    <Stack direction="row" spacing={2} ml={20} justifyContent="center">
      <FooterButton image={behemoth_icon} selection_key="behemoth"/>
      <FooterButton image={factions_icon} selection_key="faction"/>
      <FooterButton image={player_icon} selection_key="player"/>
    </Stack>
  )
}

type FooterButtonProps = {
  image: string;
  selection_key: InterfaceActiveLeft;
}

const FooterButton = observer(({image, selection_key}: FooterButtonProps) => {
  const {selectActiveLeft, isActive} = useGame().ui
  const onSelect = () => selectActiveLeft(selection_key)
  return (
    <Box
      onClick={onSelect}
      sx={{
        position: "relative",
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${grey_blue}`,
        borderRadius: BUTTON_SIZE,
        backgroundColor: `${isActive(selection_key) ? '#566f67' : '#171b1a'}`,
        transition: 'all 0.7s ease',
        '&:hover': {
          boxShadow: `inset 0 0 0 2px ${grey_blue}`,
        }
      }}>
      <img src={image} width={IMAGE_SIZE} height={IMAGE_SIZE} alt="button"/>
    </Box>
  )
})
