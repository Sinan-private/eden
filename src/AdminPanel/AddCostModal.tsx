import {Box, Modal} from "@mui/material";
import {AddCost} from "./AddCost.tsx";
import {TradeChange} from "../Resource/types.ts";
import {ResourceKeys} from "../gameRules/types.ts";

type AddCostModalProps = {
  openAddCost: boolean;
  handleCloseAddCost(): void;
  onAddCost(change: TradeChange<ResourceKeys>): void;
  costToSelectFrom: TradeChange<ResourceKeys>[];
}

export const AddCostModal = (
  {
    openAddCost,
    handleCloseAddCost,
    onAddCost,
    costToSelectFrom
  }: AddCostModalProps
) => {

  return (
    <Modal
      open={openAddCost}
      onClose={handleCloseAddCost}
    >
      <Box sx={style}>
        <AddCost onAddCost={onAddCost} cost={costToSelectFrom}/>
      </Box>
    </Modal>
  )
}

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
