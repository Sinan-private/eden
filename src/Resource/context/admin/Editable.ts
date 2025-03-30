import {ResourceStoreClass} from "@/Resource";

// Todo - Why am I starting version 3.000? I still don't like my setup and now I need to check if a key already
//  exists (overwrite or create new), I need to check if the resource is pristine (disabled buttons)
//  and I want to prepare the resource so that it checks against the ID and overwrites even if the key was changed

export class Editable {
  constructor(
    private readonly _resourceStore?: ResourceStoreClass
  ) {
    this.origin = '';
    this.update
  }

  public readonly createNewResource = () => {

  }

  public readonly updateResource = (id: string) => {

  }


}