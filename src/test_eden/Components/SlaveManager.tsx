import styled from "styled-components";
import {observer} from "mobx-react";
import {useGame} from "../context/game.context.ts";
import chains from "../../assets/images/chains.png";

export const SlaveManager = observer(() => {
  const SIZE = 280
  const {slaves, faction_marid, faction_ghoul, faction_arwa, faction_ifrit} = useGame();
  const slaveHunterImage = faction_marid.image;
  const demonsImage = faction_ifrit.image;
  const guardsImage = faction_ghoul.image;
  const mindBendersImage = faction_arwa.image;
  const {unassigned_slaves, assignToFaction, arwa, marid} = slaves;
  return (
    <div className="relative" style={{width: SIZE, height: SIZE}}>
      <SlaveTop>
        <FullSizedImage src={demonsImage} $disabled $inactive/>
      </SlaveTop>
      <SlaveLeft>
        <FullSizedImage src={guardsImage} $disabled $inactive/>
      </SlaveLeft>
      <SlaveRight onClick={() => assignToFaction('marid')}>
        <FullSizedImage src={slaveHunterImage} $disabled={!slaves.unassigned_slaves}/>
        <p>{marid}</p>

        {/*<FactionButton faction={factions.slaveHunters}/>*/}
      </SlaveRight>
      <SlaveBottom onClick={() => assignToFaction('arwa')}>
        <FullSizedImage src={mindBendersImage} $disabled={!slaves.unassigned_slaves}/>
        <p>{arwa}</p>
      </SlaveBottom>
      <SlaveCenter>
        <FullSizedImage src={chains}/>
        <p className="text-2xl">{unassigned_slaves}</p>
        {/*<p fontSize={10} px={2}>Unassigned slaves</p>*/}
      </SlaveCenter>
      <Shadow size={SIZE} x={3} y={3} color="#3f675e" blur={0} opacity={0.15}/>
    </div>
  )
})
const FullSizedImage = styled.img<{ $disabled?: boolean; $inactive?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${props => props.$inactive ? 0.2 : 1};
    filter: ${props => props.$inactive
  ? 'saturate(0.2) blur(0px) brightness(0.6) contrast(1.4)'
  : props.$disabled
    ? 'saturate(0.5) blur(0.5px) brightness(0.6) contrast(0.6)'
    : 'none'};
    transition: all 1.2s ease;
    z-index: -1;
`;
type ShadowProps = {
  size: number;
  x: number;
  y: number;
  color?: string;
  opacity?: number;
  blur?: number;
}
const Shadow = (
  {
    size,
    x,
    y,
    color = "black",
    opacity = 0.3,
    blur = 2,
  }: ShadowProps) => (
  <div className="absolute" style={{
    width: size,
    height: size,
    top: y,
    left: x,
    opacity,
    filter: `blur(${blur}px)`,
    zIndex: -1,
  }}>
    <SlaveTop $disabled $backgroundColor={color}/>
    <SlaveLeft $disabled $backgroundColor={color}/>
    <SlaveRight $disabled $backgroundColor={color}/>
    <SlaveBottom $disabled $backgroundColor={color}/>
    <SlaveCenter $disabled $backgroundColor={color}/>
  </div>
)
const SlaveAssignmentBase = styled.div<{ $disabled?: boolean, $backgroundColor?: string }>`
    position: absolute;
    width: 31%;
    height: 31%;
    cursor: ${props => props.$disabled ? 'initial' : 'pointer'};
    Top: auto;
    bottom: auto;
    right: auto;
    left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    background-color: ${props => props.$backgroundColor || '#151918'};
    transition: background-color 1.8s ease;
    clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);

    z-index: 2000;

`;
const SlaveTop = styled(SlaveAssignmentBase)`
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    //clip-path: polygon(0% 0, 100% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);
`;
const SlaveLeft = styled(SlaveAssignmentBase)`
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    //clip-path: polygon(0% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 100%);
`;
const SlaveRight = styled(SlaveAssignmentBase)`
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    //clip-path: polygon(15% 0%, 100% 0, 100% 15%, 100% 85%, 100% 100%, 15% 100%, 0 85%, 0% 15%);
`;
const SlaveBottom = styled(SlaveAssignmentBase)`
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    //clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 100% 100%, 0% 100%, 0 85%, 0 15%);
`;
const SlaveCenter = styled(SlaveAssignmentBase)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);
`