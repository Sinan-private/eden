import {ResourceBase, ResourceUpdateProps} from "../Resource";
import {icons} from "./icons.ts";

export class Resource<K extends string, T extends string> extends ResourceBase<K, T>{
  public readonly icon: string;
  constructor(raw_resource: ResourceUpdateProps<K, T>) {
    super(raw_resource);
    // This is ignored because of the annoying issue that I can only make the class so flexible. At some point I get a mismatch of the generic state vs. the one I want to use for my auto-fill. So I decided to ignore the issue on this level
    this.icon = this.__getIcon(raw_resource)
  }
    // @ts-ignore
  private readonly __getIcon = (raw_resource: ResourceUpdateProps<K, T>) => icons[raw_resource.key]
}
