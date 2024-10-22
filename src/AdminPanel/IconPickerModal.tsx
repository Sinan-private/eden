import {IconPicker, IconPickerProps} from "./IconPicker.tsx";
import {Box, Modal, Switch, Typography} from "@mui/material";
import styled from "styled-components";
import {Icon} from "../Resource/types.ts";

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
    >
      <Box sx={{...style, pt: 8}}>
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
      </Box>
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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '60vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
