import {EditOne, DotsVertical, Copy, Trash} from "@mynaui/icons-react";
import {Button} from "@/components/ui/button.tsx";
import {ResourceKeys, ResourceTypes, TradeChange} from "@/Resource";
import {Resource} from "@/Resource/ResourceHandler";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/Popover.tsx";
import {Separator} from "@/components/ui/separator.tsx";

type AdminResourcesProps = {
  resource: Resource<ResourceKeys, ResourceTypes>
}

export const AdminResource = ({resource}: AdminResourcesProps) => {
  const max = resource.max !== Infinity ? resource.max : undefined;
  const {editResource, cloneResource, resourceReferences, removeResource} = AdminController.getInstance();
  const onEdit = () => editResource(resource.id);
  const onClone = () => cloneResource(resource.id);
  const references = resourceReferences(resource.key);
  const canDelete = !references?.length

  return (
    <>
      <div className="relative overflow-hidden bg-zinc-900 py-4 sm:py-2 rounded" style={{width: 200}}>
        <div
          className="mx-auto px-4 max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex justify-between items-center">
            <img src={resource.icon} alt={resource.label}/>
            <div className="flex items-center gap-1 pr-4">
              {max
                ? <p>{resource.value}<span className="text-gray-400"> / {max}</span></p>
                : <p>{resource.value}</p>
              }
              <> {/* Here was an AlertDialogTrigger*/}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-1.5 absolute top-0 right-0 text-gray-500 hover:text-gray-200"
                    >
                      <DotsVertical/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={onEdit}
                    >
                      <EditOne size={16}/>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      // disabled
                      onClick={onClone}
                      className="justify-start"
                    >
                      <Copy size={16}/>
                      Clone
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      disabled={!canDelete}
                      onClick={() => removeResource(resource.id)}
                      className="justify-start"
                    >
                      <Trash size={16}/>
                      Delete
                    </Button>

                  </PopoverContent>
                </Popover>
              </>
            </div>
          </div>
          <p className="text-sm">{resource.label}</p>
          <p className="text-gray-500" style={{fontSize: 12}}>{resource.key}</p>
          <div className="mt-4">
            <p className="text-sm mb-1">Cost</p>
            <div>
              {resource.cost?.give.map(give => (
                <CostView key={give.key} trade={give}/>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

type CostViewProps = {
  trade: TradeChange;
}


const CostView = ({trade}: CostViewProps) => {
  const {getByKey} = AdminController.getInstance().cloneResourceStore;
  const resource = getByKey(trade.key)
  return (
    <div className="flex items-center gap-1">
      <span
        className="inline-flex items-center rounded-md bg-zinc-950 px-2 py-1 text-xs font-medium text-gray-100 ring-1 ring-gray-500/10 ring-inset">
        {trade.value}
      </span>

      <img width={16} height={16} src={resource?.icon} alt={trade.label}/>
      <p className="text-xs">
        {resource?.label}
      </p>
    </div>
  )
}