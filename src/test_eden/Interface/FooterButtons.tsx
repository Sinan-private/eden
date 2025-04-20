import {observer} from "mobx-react";
import behemoth_icon from '../../assets/images/behemoth_icon.png'
import factions_icon from '../../assets/images/factions.png'
import player_icon from '../../assets/images/Player_stats.png'
import {InterfaceActiveLeft} from "./InterfaceController.ts";
import {game} from "@/test_eden/context/createSingletonGame.ts";

const BUTTON_SIZE = 50;
const IMAGE_SIZE = BUTTON_SIZE * 0.8


export const FooterButtons = () => {
  return (
    <div className="flex gap-2 ml-20 justify-center">
      <FooterButton image={behemoth_icon} selection_key="behemoth"/>
      <FooterButton image={factions_icon} selection_key="faction"/>
      <FooterButton image={player_icon} selection_key="player"/>
    </div>
  )
}

type FooterButtonProps = {
  image: string;
  selection_key: InterfaceActiveLeft;
}

const FooterButton = observer(({image, selection_key}: FooterButtonProps) => {
  const {selectActiveLeft, isActive} = game().interface
  const onSelect = () => selectActiveLeft(selection_key)
  return (
    <div className={`relative flex align-middle justify-center border-2 border-cyan-900 transition hover:bg-cyan-950 ${isActive(selection_key) ? 'bg-cyan-900' : ''}`}
      onClick={onSelect}
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE,
        transition: 'all 0.7s ease',
      }}>
      <img src={image} width={IMAGE_SIZE} height={IMAGE_SIZE} alt="button"/>
    </div>
  )
})
