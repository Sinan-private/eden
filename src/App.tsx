import {AdminResourceProvider, ResourceStoreClass} from "./Resource";
import {Game} from "./test_eden/Game.tsx";
import {GameProvider} from "./test_eden/context/game.context.ts";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {useApi} from "@/Resource/hooks/useApi.ts";
import {useComponentMount} from "@/Resource/hooks";
import {ResourceStore} from "@/Resource/ResourceHandler/ResourceStore.ts";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {GameClass} from "@/test_eden/Classes/GameClass.ts";

function App() {
  const {fetchResources} = useApi();
  const [loaded, setLoaded] = useState(false);
  const resourceRef = useRef<ResourceStoreClass | null>(null) as MutableRefObject<ResourceStoreClass | null>;
  const resourceStore = resourceRef.current as ResourceStoreClass;

  useComponentMount(async () => {
    const rawState = await fetchResources();
    const resourceStore = new ResourceStore(rawState, 'resource.context') as ResourceStoreClass;
    resourceRef.current = resourceStore;
    setLoaded(true);
    console.log('App', resourceStore.id)
    AdminController.getInstance(resourceStore)
    GameClass.getInstance(resourceStore)
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.add("dark")
  }, []);

  if (!loaded) {
    return null
  }

  return (
    <>
      <AdminResourceProvider initialState={{
        admin: {buttonPosition: "bottom-right"},
        resourceStore
      }}>
        <GameProvider initialState={resourceStore}>
          <Game/>
        </GameProvider>
      </AdminResourceProvider>
    </>
  )
}

export default App
