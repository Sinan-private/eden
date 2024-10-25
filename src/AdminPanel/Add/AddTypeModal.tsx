import Modal from "../Modal.tsx";
import {AddType} from "./AddType.tsx";

type AddTypeProps = {
  open: boolean;
  onClose(): void;
}

export const AddTypeModal = (
  {
    open,
    onClose
  }: AddTypeProps
) => (
    <Modal open={open} onClose={onClose}>
      <AddType />
    </Modal>
  )
