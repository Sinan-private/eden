import {useMemo} from "react";
import {Image} from "@mynaui/icons-react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Separator,
} from "@/GameController/components/ui";
import {EditResourceBase} from "@/GameController/Resource/Admin/Resource/Edit/EditResourceBase.tsx";
import {EditResourceValue} from "@/GameController/Resource/Admin/Resource/Edit/EditResourceValue.tsx";
import {EditResourceCost} from "@/GameController/Resource/Admin/Resource/Edit/EditResourceCost.tsx";
import {observer} from "mobx-react";
import {game} from "@/Game/Classes/Game";

export const EditResource = () => {
  const {getResourceForInput} = game().admin
  const {resource} = useMemo(getResourceForInput, [getResourceForInput])

  return (
    <AlertDialogContent className="overflow-y-auto max-h-full">
      <AlertDialogHeader className="flex-row justify-between items-center mb-2 space-y-0">
        <AlertDialogTitle>
          {resource.label}
        </AlertDialogTitle>
        <Button variant="ghost">
          {resource.icon && !resource.icon.endsWith('empty.png')
            ? <img src={resource.icon} alt={resource.label} width={24} height={24}/>
            : <Image/>
          }
        </Button>
      </AlertDialogHeader>
      <AlertDialogDescription style={{display: 'none'}}>
        Edit resource
      </AlertDialogDescription>
      <div>
        <div className="flex flex-col gap-2">
          <EditResourceBase />
          <Separator className="my-8"/>
          <EditResourceValue />
          <Separator className="my-8"/>
          <EditResourceCost />
        </div>
      </div>
      <FormButtons />
    </AlertDialogContent>
  )
}

const FormButtons = observer(() => {
  const {
    resetEditableResource,
    onSave,
    saveDisabled,
  } = game().admin
  const disableSave = saveDisabled()
  return (
    <AlertDialogFooter>
      <AlertDialogCancel onClick={resetEditableResource}>Cancel</AlertDialogCancel>
      <AlertDialogAction disabled={disableSave} onClick={onSave}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  )
})
