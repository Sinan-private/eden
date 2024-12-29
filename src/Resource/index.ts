// Those are the providers that need to wrap the whole app
// - Use ResourceProvider for regular usage of resources
// - Use AdminResourceProvider to also include the Admin Panel handling resources
export {ResourceProvider} from "./Providers/ResourceProvider.tsx";
export {AdminResourceProvider} from "./Providers/AdminResourceProvider.tsx";

// Those are the hooks to read and manipulate the states.
// - useResource is for direct interaction or printing of resources
// - useTickSubscription is used for updates that happen on every tick
export {useResource} from "./context/resource.context.ts";
export {useTickSubscription} from "./hooks/useTickSubscription.ts";

export type {ResourceTypes} from "./ResourceHandler/specificTypes.ts";
export type {ResourceKeys} from "./ResourceHandler/specificTypes.ts";
export type {ResourceClass} from "./ResourceHandler/specificTypes.ts";
export type {ResourceState} from "./ResourceHandler/specificTypes.ts";
export type {ResourceStoreClass} from "./ResourceHandler/specificTypes.ts";
export type {TradeChange} from "./ResourceHandler/specificTypes.ts";
export type {TickSubscription} from "./hooks/useTickSubscription.ts";
