import {AdminResourceProvider, ResourceKeys, ResourceStoreClass, ResourceTypes} from "./Resource";
import {Game} from "./test_eden/Game.tsx";
import {GameProvider} from "./test_eden/context/game.context.ts";
import {MutableRefObject, useRef, useState} from "react";
import {useApi} from "@/Resource/hooks/useApi.ts";
import {useComponentMount} from "@/Resource/hooks";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {createSingletonResourceStore} from "@/Resource/ResourceHandler/createSingletonResourceStore.ts";
import {createSingletonGame} from "@/test_eden/context/createSingletonGame.ts";

function App() {

const GlobalStore = createSingletonResourceStore<ResourceKeys, ResourceTypes>()
  const {fetchResources} = useApi();
  const [loaded, setLoaded] = useState(false);
  const resourceRef = useRef<ResourceStoreClass | null>(null) as MutableRefObject<ResourceStoreClass | null>;
  const _resourceStore = resourceRef.current as ResourceStoreClass;
  useComponentMount(async () => {
    const rawResources = await fetchResources();
    createSingletonGame<ResourceKeys, ResourceTypes>().getInstance({resources: rawResources})
    const resourceStore = GlobalStore.getInstance(rawResources) // This could already be called empty. Just leaving the rawResources in for safety
    resourceRef.current = resourceStore;
    setLoaded(true);
    AdminController.getInstance(resourceStore)
  })

  if (!loaded) {
    return null
  }

  return (
    <>
      <AdminResourceProvider initialState={{
        admin: {buttonPosition: "bottom-right"},
        resourceStore: _resourceStore
      }}>
        <GameProvider initialState={_resourceStore}>
          <Game/>
        </GameProvider>
      </AdminResourceProvider>
    </>
  )
}

export default App
