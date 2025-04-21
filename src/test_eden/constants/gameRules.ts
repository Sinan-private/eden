import {STAMINA_DRAIN} from "./constants.ts";

export const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
