import Modal, {ModalProps} from "@mui/material/Modal";
import Box from "@mui/material/Box";

const StyledModal = ({children, sx, ...props}: ModalProps) => (
  <Modal {...props}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      ...sx
    }}>
      {children}
    </Box>
  </Modal>
)

export default StyledModal;
