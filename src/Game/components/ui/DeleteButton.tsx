import {Trash} from "@mynaui/icons-react";
import {Button, ButtonProps} from "@/Game/components/ui/button.tsx";

export const DeleteButton = ({className, ...props}: ButtonProps) => (
  <Button
    {...props}
    variant="ghost"
    className={"hover:text-red-500 rounded-full w-9 h-9 " + className}
    onClick={props.onClick}
  >
    <Trash />
  </Button>
)
