import {observer} from "mobx-react";
import {ResourceClass} from "src/Game/Resource";
import {Progress} from "@/components/ui/progress.tsx";

type ValueDisplayProps = {
  resource: ResourceClass;
  label?: string;
}
export const ValueDisplay = observer(({resource, label = resource.label}: ValueDisplayProps) => (
  <div>
    <div className="flex justify-between">
      <p >{label}</p>
      <p>{resource.beautify.value}</p>
    </div>
    <Progress value={resource.percentage} color="red" />
  </div>
))