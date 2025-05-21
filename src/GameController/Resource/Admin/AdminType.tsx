import {ChangeEvent, useState} from "react";
import {observer} from "mobx-react";
import {game} from "@/Game";
import {Trash} from "@mynaui/icons-react";
import {Button, Input, Badge} from "@/GameController/components/ui";
import {removeType, addType} from "@/GameController/Resource/server/api/apiService.ts";
import {ResourceTypes} from "@/GameController/Resource";

export const AdminType = observer(() => {
  const {admin} = game()
  const {
    cloneResourceStore,
    removeType: _removeType,
    addType: _addType,
    types
  } = admin

  const usedTypes = cloneResourceStore.getByType().map(({type}) => type);
  const onRemoveType = (resourceType: ResourceTypes) => {
    // This is my rather dirty version of an optimistic update
    _removeType(resourceType)
    removeType([resourceType]).catch(() => {
      _addType(resourceType)
    })
  }

  return (
    <>
      <p className="text-2xl">Resource types</p>
      <div className="p-4 flex flex-col gap-2">
        {types.map((resourceType: ResourceTypes) => (
          <div key={resourceType} className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onRemoveType(resourceType)}
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
})


const AddType = () => {
  // Don't really like that the whole syncing logic is happening here. Could be refactored at some point
  const {
    removeType: _removeType,
    addType: _addType
  } = game().admin
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const onAddType = () => {
    _addType(input)
    addType(([] as string[]).concat(input)).catch(() => {
      _removeType(input)
    })
    setInput('')
  }
  return (
    <div className="flex gap-2">
    <Input
      value={input}
      onChange={onChange}
      className="w-[240px]"
    />
      <Button onClick={onAddType}>
        Add
      </Button>
    </div>
  )
}
