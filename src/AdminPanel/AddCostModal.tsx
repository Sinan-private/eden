// import {Box, Modal} from "@mui/material";
import Modal from './Modal.tsx'
import {AddCost} from "./AddCost.tsx";
import {TradeChange} from "../Resource/types.ts";
import {ResourceKeys} from "../gameRules/types.ts";

type AddCostModalProps = {
  openAddCost: boolean;
  costToSelectFrom: TradeChange<ResourceKeys>[];
  handleCloseAddCost(): void;
  onAddCost(change: TradeChange<ResourceKeys>): void;
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
        <AddCost onAddCost={onAddCost} cost={costToSelectFrom}/>
    </Modal>
  )
}
