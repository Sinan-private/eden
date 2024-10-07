import {ResourceKeys} from "./types.ts";
import forrester from '../assets/icons/forrester.png';
import meat from '../assets/icons/meat2.png';
import money from '../assets/icons/chest.png';
import bread from '../assets/icons/bread.png';
import brick from '../assets/icons/brick.png';
import gold from '../assets/icons/money_gold.png';
import plank from '../assets/icons/plank.png';
import wood from '../assets/icons/wood.png';
import wool from '../assets/icons/wool.png';
import empty from '../assets/icons/empty.png';

type IconList<K extends string> = Record<K, string>

export const icons: IconList<ResourceKeys> = {
  bakery: empty,
  bread: bread,
  bricks: brick,
  citizen: empty,
  corn: empty,
  field: empty,
  flour: empty,
  gold,
  iron: empty,
  land: empty,
  milk: empty,
  pasture: empty,
  planks: plank,
  stone: empty,
  water: empty,
  well: empty,
  windmill: empty,
  wood,
  wood_mill: empty,
  wool,
  forrester,
  meat,
  money,
  engineer: empty,
  scientist: empty,
  artist: empty,
  magician: empty,
}