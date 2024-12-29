// Those are the providers that need to wrap the whole app
// - Use ResourceProvider for regular usage of resources
// - Use AdminResourceProvider to also include the Admin Panel handling resources
export {ResourceProvider} from "./Providers/ResourceProvider.tsx";
export {AdminResourceProvider} from "./Providers/AdminResourceProvider.tsx";

export {useGame} from "./context/game.context.ts";
export {useTickSubscription} from "./hooks/useTickSubscription.ts";

export type {ResourceTypes} from "./ResourceHandler/specificTypes.ts";
export type {ResourceKeys} from "./ResourceHandler/specificTypes.ts";
export type {ResourceClass} from "./ResourceHandler/specificTypes.ts";
export type {ResourceState} from "./ResourceHandler/specificTypes.ts";
export type {ResourceStoreClass} from "./ResourceHandler/specificTypes.ts";
export type {TradeChange} from "./ResourceHandler/specificTypes.ts";
