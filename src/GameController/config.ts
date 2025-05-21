// Default Config
import {TickCreationProps} from "@/GameController/components/Constructors/Tick.ts";
import {AdminControllerCreationProps} from "@/GameController/Resource/Admin/AdminController.ts";

type Config = {
  tick: TickCreationProps;
  admin: AdminControllerCreationProps
}
export const config: Config = {
  tick: {
    ticks_per_second: 50,
    ticks_per_turn: 50,
    auto_start: false,
  },
  admin: {
    show_context_menu: true,
    show_debug_panel: false,
    show_debug_panel_beautified_values: false,
    show_admin_panel: false,
  },
};

// The nice thing is that I am able to enable and disable everything via the window object

