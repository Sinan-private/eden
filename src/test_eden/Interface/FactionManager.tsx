import styled from "styled-components";
import {Progress} from "@/components/ui/progress.tsx";
import {useGame} from "../context/game.context.ts";
import {FactionKeys} from "@/test_eden/Classes/Factions/FactionClass.ts";

export const FactionManager = () => {
  const {faction_marid, faction_ghoul, faction_arwa, faction_ifrit, slaves} = useGame();
  // const all = Object.values(factions);
  const all = [faction_marid, faction_ghoul, faction_arwa, faction_ifrit]
  const addSlave = (faction: FactionKeys) => slaves.assignToFaction(faction)
  return (
    <div className="flex, flex-col, justify-between gap-2">
      {all.map(({image, visible, active, loyalty, influence, progress, setActive, faction}) => (
        <div id={'Faction Button ' + faction} key={image} style={{display: visible ? 'flex' : 'none'}}>
          <div>
            <div className="relative" style={{width: 70, height: 70, zIndex: 2}}>
              <img
                onClick={setActive}
                src={image}
                alt={image}
                style={{
                  width: '100%',
                  height: '100%',
                  filter: active ? '' : 'saturate(0) brightness(0.2) contrast(0.8)'
                }}
              />
              <BottomLeft id="Faction button bottom left">
                {slaves[faction]}
              </BottomLeft>
              {active &&
                <VerticalProgress value={progress.value}/>
              }
            </div>
            <div style={{width: 70}}>
              <Progress
                className="h-1 rounded-none"
                value={active ? loyalty.value : 0}
                color={active ? "yellow" : "default"}
              />
              <Progress
                className="h-1 rounded-none"
                value={active ? influence.value : 0}
                color={active ? "red" : "default"}
              />
            </div>
          </div>
          <button
            onClick={() => addSlave(faction)}
            disabled={!slaves.can_assign || !active}
            style={{
              position: 'relative',
              padding: 8,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              left: -1,
            }}>+
          </button>
        </div>
      ))}
    </div>
  )
}

const VerticalProgress = ({value = 50}: { value?: number }) => {
  return (
    <div id="custom progress" className="h-full absolute" style={{width: 4, background: '#ffffff21', bottom: 0, right: 0}}>
      <VerticalBar $height={value}/>
    </div>
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

const BottomLeft = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.69);
    padding: 0 4px;
    font-size: 14px;
    //text-shadow:
    //        1px 1px 0 #000,
    //        -1px 1px 0 #000,
    //        -1px -1px 0 #000,
    //        1px -1px 0 #000;
`;