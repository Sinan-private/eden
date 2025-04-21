import {ResourceUpdateProps} from "@/GameController/Resource/ResourceHandler";
import {ResourceKeys, ResourceTypes} from "@/GameController/Resource/ResourceHandler/specificTypes.ts";

// Here all the logic of the game is bundled into a single class that can be imported everywhere

export interface GameCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]
}

