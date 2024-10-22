import Modal, {ModalProps} from "@mui/material/Modal";
import Box from "@mui/material/Box";

const StyledModal = ({children, sx, ...props}: ModalProps) => (
  <Modal {...props}>
{/*@ts-ignore*/}
    <Box sx={{...style, ...sx}}>
      {children}
    </Box>
  </Modal>
)

export default StyledModal;

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
