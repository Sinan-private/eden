import {STAMINA_DRAIN} from "../../GameController/Resource/constants.ts";

export const staminaDrain = (speed: number) => speed / 100 * 3 * STAMINA_DRAIN
