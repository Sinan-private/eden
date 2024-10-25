import Modal from "./Modal.tsx";
import {EditResource} from "./EditResource.tsx";

import {ResourceKeys} from "../Resource/specificTypes.ts";

type NewResourceProps = {
  open: boolean;
  onClose(): void;
}

export const AddResourceModal = (
  {
    open,
    onClose
  }: NewResourceProps
) => {

  return (
    <Modal open={open} onClose={onClose}>
      <EditResource
        resource={{
          key: 'new' as ResourceKeys,
          iconName: 'empty'
        }}
        enableKeyEdit
        sx={{minWidth: 1000}}
      />
    </Modal>
  )
}