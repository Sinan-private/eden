import {useMemo} from "react";
import {Button, DeleteButton} from "@/GameController/components/ui";
import {EditResourceCostType} from "@/GameController/Resource/Admin/Resource/Edit/EditResourceCostType.tsx";
import {observer} from "mobx-react";
import {game} from "@/Game/Classes/Game";

export const EditResourceCost = observer(() => {
  const {getResourceForInput, editing} = game().admin
  const {addCost, resource} = useMemo(getResourceForInput, [getResourceForInput])
  const removeCost = () => editing?.setTo({cost: null})

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <DeleteButton onClick={removeCost}/>
        <p className="text-lg">Cost</p>
        {!resource.cost &&
          <Button size="sm" variant="outline" onClick={addCost}>+ Add cost</Button>
        }
      </div>
      {resource.cost &&
        <div className="flex justify-between gap-4 items-start">
          <EditResourceCostType trade={resource.cost} type="give"/>
          <EditResourceCostType trade={resource.cost} type="gain"/>
        </div>
      }
</div>
)
})
