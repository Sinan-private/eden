import {AdminResourceProvider} from "./Resource";
import {Game} from "./test_eden/Game.tsx";
import {GameProvider} from "./test_eden/context/game.context.ts";
import {useState} from "react";
import {useApi} from "@/Resource/hooks/useApi.ts";
import {useComponentMount} from "@/Resource/hooks";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {createSingletonGame} from "@/test_eden/context/createSingletonGame.ts";

function App() {
  const {fetchResources} = useApi();
  const [loaded, setLoaded] = useState(false);
  useComponentMount(async () => {
    const rawResources = await fetchResources();
    const _resourceStore = createSingletonGame().getInstance({resources: rawResources})
    setLoaded(true);
    AdminController.getInstance(_resourceStore.resources)
  })

  if (!loaded) {
    return null
  }

  return (
    <>
      <AdminResourceProvider initialState={{
        admin: {buttonPosition: "bottom-right"},
      }}>
        <GameProvider>
          <Game/>
        </GameProvider>
      </AdminResourceProvider>
    </>
  )
}

export default App
