import Modal from "./Modal.tsx";
import {EditResource} from "./EditResource.tsx";
import {ResourceKeys} from "../Resource/types.ts";

type NewResourceProps = {
  open: boolean;
  onClose(): void;
}

export const AddResource = (
  {
    open,
    onClose
  }: NewResourceProps
) => {

  return (
    <Modal open={open} onClose={onClose}>
      <EditResource resource={{
        key: 'new' as ResourceKeys,
        iconName: 'empty'
      }} />
    </Modal>
  )
}