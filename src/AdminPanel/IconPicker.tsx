import styled from "styled-components";
import {Icon} from "../Resource/genericTypes.ts";
import {useAdmin} from "../Resource/Admin/admin.context.ts";
import {TextField} from "@mui/material";
import {ChangeEvent, useState} from "react";

export type IconPickerProps = {
  // filter?: 'used' | 'unused' | 'all';
  showUsed?: boolean;
  onClick?(icon: Icon): void;
}

export const IconPicker = ({showUsed = false, onClick}: IconPickerProps) => {
  const {icons} = useAdmin().resources;
  const [filter, setFilter] = useState('');
  const onClickIcon = (icon: Icon) => () =>
    onClick ? onClick(icon) : () => {
    }
  const onSetFilter = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFilter(e.target.value);
  }

  const shownIcons = filter.length ? icons.getUnused().filter(({name}) => name.includes(filter)) : icons.getUnused();

  return (
    <Container>
      <TextField
        sx={{mb: 2}}
        label="Filter"
        size="small"
        value={filter}
        onChange={onSetFilter}
      />
      <IconContainer>
        {shownIcons.map(({name, src}) => (
          <SingleIconContainer key={name} onClick={onClickIcon({name, src})} $filter="unused">
            <img src={src} alt={name} style={{alignSelf: 'center'}}/>
            <div style={{fontSize: '0.7rem', textAlign: 'center'}}>{name}</div>
          </SingleIconContainer>
        ))}
        {showUsed && icons.getUsed().map(({name, src}) => (
          <SingleIconContainer key={name} onClick={onClickIcon({name, src})} $filter="used">
            <img src={src} alt={name} style={{alignSelf: 'center'}}/>
            <div style={{fontSize: '0.7rem', textAlign: 'center'}}>{name}</div>
          </SingleIconContainer>
        ))}
      </IconContainer>
    </Container>
  )
}

const Container = styled.div`
    position: relative;
`;


const IconContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 60vw;
    gap: 8px;
    overflow: auto;
    max-height: 400px;
    //max-height: 100%;
`;

const SingleIconContainer = styled.div<{ $filter: 'used' | 'unused' }>`
    display: flex;
    justify-content: center;
    width: 80px;
    height: 60px;
    padding: 4px 0;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 4px;
    flex-direction: column;
    background-color: ${props => props.$filter === 'used' ? '#0000005e' : 'transparent'};
    opacity: ${props => props.$filter === 'used' ? 0.3 : 1};
`;