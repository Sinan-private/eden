import {PlusCircle} from "@mynaui/icons-react";

export const AddButton = ({onClick}: {onClick(): void}) => (
  <PlusCircle
    className="text-2xl text-gray-500 hover:text-gray-100 transition cursor-pointer"
    onClick={onClick}
  />
)