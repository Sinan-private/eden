import {EditOne} from "@mynaui/icons-react";
import {Resource} from "@/Resource/ResourceHandler";
import {ResourceKeys, ResourceTypes, TradeChange} from "@/Resource";
import {useAdmin} from "@/Resource/context/admin.context.ts";
import {Button} from "@/components/ui/button.tsx";

type AdminResourcesProps = {
  resource: Resource<ResourceKeys, ResourceTypes>
}

export const AdminResource = ({resource}: AdminResourcesProps) => {
  const max = resource.max !== Infinity ? resource.max : undefined;
  const {onOpenAlertDialog} = useAdmin()

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
                <Button
                  variant="ghost"
                  className="p-1.5 absolute top-0 right-0 text-gray-500 hover:text-gray-200"
                  onClick={() => onOpenAlertDialog(resource)}
                >
                  <EditOne size={16}/>
                </Button>
              </>
            </div>
          </div>
          <p className="text-sm">{resource.label}</p>
          <p className="text-gray-500" style={{fontSize: 12}}>{resource.key}</p>
          <div className="mt-4">
            <p className="text-sm mb-1">Cost</p>
            <div>
              {resource.cost?.give.map(give => (
                <ConstView key={give.key} trade={give}/>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

type ConstViewProps = {
  trade: TradeChange;
}

const ConstView = ({trade}: ConstViewProps) => {
  const {get} = useAdmin().resources;
  const resource = get(trade.key)
  return (
    <div className="flex items-center gap-1">
      <span
        className="inline-flex items-center rounded-md bg-zinc-950 px-2 py-1 text-xs font-medium text-gray-100 ring-1 ring-gray-500/10 ring-inset">
        {trade.value}
      </span>

      <img width={16} height={16} src={resource.icon} alt={trade.label}/>
      <p className="text-xs">
        {resource.label}
      </p>
    </div>
  )
}