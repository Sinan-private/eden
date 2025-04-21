import {ChangeEvent, useState} from "react";
import {Trash} from "@mynaui/icons-react";
import {game} from "@/Game";
import {ResourceTypes} from "@/GameController/Resource";
import {Button, Input, Badge} from "@/GameController/components/ui";
import {useApi} from "@/GameController/Resource/hooks/useApi.ts";

export const AdminType = () => {
  const {admin, resources: {getTypes}} = game()
  const {cloneResourceStore} = admin
  const {removeType} = useApi()

  const usedTypes = cloneResourceStore.getByType().map(({type}) => type);
  const types = getTypes()

  return (
    <>
      <p className="text-2xl">Resource types</p>
      <div className="p-4 flex flex-col gap-2">
        {types.map((resourceType: ResourceTypes) => (
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