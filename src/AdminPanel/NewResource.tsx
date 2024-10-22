import Modal from "./Modal.tsx";

type NewResourceProps = {
  open: boolean;
  onClose(): void;
}

export const NewResource = (
  {
    open,
    onClose
  }: NewResourceProps
) => {

  return (
    <Modal open={open} onClose={onClose}>
      <div>NewResource</div>
    </Modal>
  )
}