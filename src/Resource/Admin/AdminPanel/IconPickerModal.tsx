import {IconPicker, IconPickerProps} from "./IconPicker.tsx";
import {Switch, Typography} from "@mui/material";
import Modal from "./Modal.tsx";
import styled from "styled-components";
import {Icon} from "../../genericTypes.ts";

type IconPickerModalProps = {
  openIconPicker: boolean;
  handleCloseIconPicker(): void;
  filterUsed: boolean;
  onToggleFilter(): void;
  onSelectIcon(clickedIcon: Icon): void;
} & IconPickerProps;

export const IconPickerModal = (
  {
    openIconPicker,
    handleCloseIconPicker,
    filterUsed,
    onToggleFilter,
    onSelectIcon
  }: IconPickerModalProps) => {
  return (
    <Modal
      open={openIconPicker}
      onClose={handleCloseIconPicker}
      sx={{pt: 8}}
    >
      <>
        <Header>
          <Typography variant="body2" sx={{pr: 1}}>
            Used items
          </Typography>
          <Switch
            value={filterUsed}
            onChange={onToggleFilter}
            size="small"
            sx={{mr: 2}}
          />
        </Header>
        <IconPicker showUsed={filterUsed} onClick={onSelectIcon}/>
      </>
    </Modal>
  )
}

const Header = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
