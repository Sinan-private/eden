import {Resource} from "@/GameEngine/ResourceEngine/ResourceHandler";
import {ResourceCostUpdate} from "@/GameEngine/ResourceEngine/ResourceHandler/genericTypes.ts";

export const resourceReferences = <K extends string, T extends string>(
  key: K,
  allResources: Resource<K, T>[]
): K[] => {
  const dependencyKeys: (keyof Resource<K, T>)[] = ["cost", "revealedAt"];

  return allResources
    .filter(resource => {
      if (resource.key === key) return false; // Exclude self-reference

      return dependencyKeys.some(depKey => {
        const dependency = resource[depKey] as ResourceCostUpdate<K, T> | null;
        if (!dependency) return false;

        const isReferencedInGive = dependency.give.some(item => item.key === key);
        const isReferencedInGain = dependency.gain.some(item => item.key === key);

        return isReferencedInGive || isReferencedInGain;
      });
    })
    .map(resource => resource.key);
}
