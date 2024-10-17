import {ResourceKeys} from "./types.ts";
import forrester from '../assets/icons/forrester.png';
import meat from '../assets/icons/meat2.png';
import money from '../assets/icons/chest.png';
import bread from '../assets/icons/bread.png';
import brick from '../assets/icons/brick.png';
import gold from '../assets/icons/brick_gold.png';
import plank from '../assets/icons/plank.png';
import wood from '../assets/icons/wood.png';
import wool from '../assets/icons/wool.png';
import empty from '../assets/icons/empty.png';
import clothes from '../assets/icons/clothes.png';
import clothes2 from '../assets/icons/clothes2.png';
import harp from '../assets/icons/harp.png';
import helmet from '../assets/icons/helmet.png';
import book2 from '../assets/icons/book2.png';
import wheat from '../assets/icons/wheat.png';
import water from '../assets/icons/water.png';
import stone from '../assets/icons/stone.png';
import flour from '../assets/icons/flour.png';
import milk from '../assets/icons/milk.png';
import coal from '../assets/icons/coal.png';
import land from '../assets/icons/land.png';

type IconList<K extends string> = Record<K, string>

export const icons: IconList<ResourceKeys> = {
  bakery: empty,
  bread: bread,
  bricks: brick,
  corn: wheat,
  field: empty,
  flour,
  gold,
  iron: empty,
  land,
  milk,
  pasture: empty,
  planks: plank,
  coal,
  stone,
  water: water,
  well: empty,
  windmill: empty,
  wood,
  wood_mill: empty,
  wool,
  forrester,
  meat,
  money,
  citizen: clothes2,
  engineer: helmet,
  scientist: book2,
  artist: harp,
  magician: clothes,
}