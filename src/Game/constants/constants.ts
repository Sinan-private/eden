// Config
export const TICKS_PER_SECOND = 40;
export const TICKS_PER_TURN = 20;
export const TICK_AUTO_START = false;
export const DEBUG = false;
export const BEAUTIFY_DEBUG = false;


// GameClass start
export const AUTO_CLIMB = false
export const AUTO_COLLECT_MANA = true
export const AUTO_CRAFT = true
export const AUTO_SLAVE_HUNT = true


// Slaves
export const SLAVES_INITIALLY_MARID = 4;
export const SLAVES_INITIALLY_ARWA = 4;

// Behemoth
export const BEHEMOTH_STAMINA_PER_WASTED_SLAVE = 15;
export const BEHEMOTH_STAMINA_PER_SLAVE = 35;


// Coefficients
export const CLIMBING_SPEED_COEFFICIENT = 0.3
export const FLUSHING_SPEED = 1;
export const DRYING_SPEED = 3;
export const HARVEST_SPEED = 0.7;
export const CRAFTING_SPEED = 0.5;
export const MANA_FINDINGS = [1, 20, 300, 4000, 50000];
export const STAMINA_DRAIN = 1.5
export const STAMINA_REGEN = 0.3
export const MANA_TRANSFER = 0.4 // This it the global coefficient of mana transfer between states per tick
// export const STAMINA_DRAIN = 200
// export const STAMINA_REGEN = 1
export const STAMINA_REGEN_ON_FLUSHING = 0.05
export const SLAVE_CREATION = 0.5
