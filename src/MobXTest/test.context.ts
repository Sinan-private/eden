import {createContainer} from "unstated-next";
import {Timer} from "./Timer.ts";
import {ResourceStore} from "../Version 2/Resource_MobX/ResourceStore.ts";
import {useComponentMount} from "../Resource/hooks/useComponentMount.ts";
import {useApi} from "../context/useApi.ts";
import {useMemo} from "react";
import {ResourceBase} from "../Version 2/Resource_MobX/ResourceBase";

const corn = new ResourceBase({key: 'corn', value: 10})

const useTestBase = () => {
  const {fetchResources} = useApi();
  const timer = useMemo(() => new Timer, []);
const resources = useMemo(() => new ResourceStore(), []);
  useComponentMount(async () => {
    const rawState = await fetchResources();
    resources.initializeResources(rawState)
  })
  return {
  corn,
    timer,
    resources,
  };
}


const useTestContainer = createContainer(useTestBase);
export const useTest = useTestContainer.useContainer;
export const TestProvider = useTestContainer.Provider;
