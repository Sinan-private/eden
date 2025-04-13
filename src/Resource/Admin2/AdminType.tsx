import CancelIcon from "@mui/icons-material/Cancel";
import {useAdmin} from "@/Resource/context/admin2.context.ts";
import {resourceTypes} from "@/Resource/generated/resourceTypes.ts";
import {ResourceTypes} from "@/Resource";
import {Button} from "@/components/ui/button.tsx";
import {useWriteToFile} from "@/Resource/context/admin/useWriteToFile.ts";
import {Input} from "@/components/ui/input.tsx";
import {ChangeEvent, useState} from "react";
import {useApi} from "@/Resource/hooks/useApi.ts";

export const AdminType = () => {
  const {resources} = useAdmin();
  const {removeType} = useApi()

  const usedTypes = resources.getByType().map(({type}) => type);
  // const write__removeType = (a: any) => {}

  return (
    <>
      HandleTypes
      <div className="p-4 flex flex-col gap-2">
        {resourceTypes.map((resourceType: ResourceTypes) => (
          <div key={resourceType}>
            <p key={resourceType}>
              {resourceType}
            </p>
            <Button
              onClick={() => removeType([resourceType])}
              disabled={usedTypes.includes(resourceType)}
            >
              <CancelIcon />
            </Button>
          </div>
        ))}
        <AddType />
      </div>
    </>
  )
}

const AddType = () => {
  const {write__addType} = useWriteToFile();
  const [input, setInput] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const onSubmit = () => {
    write__addType(input);
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