import {Trash} from "@mynaui/icons-react";
import {resourceTypes} from "@/Resource/generated/resourceTypes.ts";
import {ResourceTypes} from "@/Resource";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ChangeEvent, useState} from "react";
import {useApi} from "@/Resource/hooks/useApi.ts";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {Badge} from "@/components/ui/Badge.tsx";

export const AdminType = () => {
  const {cloneResourceStore} = AdminController.getInstance()
  const {removeType} = useApi()

  const usedTypes = cloneResourceStore.getByType().map(({type}) => type);
  // const write__removeType = (a: any) => {}

  return (
    <>
      <p className="text-2xl">Resource types</p>
      <div className="p-4 flex flex-col gap-2">
        {resourceTypes.map((resourceType: ResourceTypes) => (
          <div key={resourceType} className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => removeType([resourceType])}
              disabled={usedTypes.includes(resourceType)}
            >
              <Trash />
            </Button>
            <Badge variant="outline">

            <p key={resourceType} className="mr-2">
              {resourceType}
            </p>
            <p>{cloneResourceStore.getByType(resourceType).length}</p>
            </Badge>
          </div>
        ))}
        <AddType />
      </div>
    </>
  )
}

const AddType = () => {
  const {addType} = useApi();
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const onSubmit = () => {
    addType(([] as string[]).concat(input))
    setInput('')
  }
  return (
    <div className="flex gap-2">
    <Input
      value={input}
      onChange={onChange}
      className="w-[240px]"
    />
      <Button onClick={onSubmit}>
        Add
      </Button>
    </div>
  )
}