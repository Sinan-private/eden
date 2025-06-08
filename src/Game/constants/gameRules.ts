import {STAMINA_DRAIN} from "@/Game/constants/constants.ts";

export const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
