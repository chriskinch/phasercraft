import { v4 as uuidv4 } from 'uuid';
import { Categories, Qualities, Stats } from './constants';
import { findKey, random, sample, sampleSize } from 'lodash';

import * as FCG from "fantasy-content-generator";

type Quality = keyof typeof Qualities;
type QualityLevel = {
  keys: string[],
  pool: number,
  qualitySort: number,
  cost: number
} | undefined;
type QualityMap = {
  [key:string]: QualityLevel
}
type Stat = {
  [key:string]: number
}
interface Schema {
  name?: string;
  category?: string;
  cost?: number;
  icon?: string;
  pool?: number;
  quality?: Quality;
  qualitySort?: number;
  set?: string;
  stats?: Stat[];
}
interface IMagicItemGenerateProps {
  seed?: string;
  type?: string;
  powerLevel?: string;
  schoolOfMagic?: string;
  effects?: string[];
  subtype?: string;
  formattedData: {
    title: string
  }
}

const getRandomStatNames = (number = 1) => sampleSize(Stats, number);

const getQualityMap = () => ({
  common: {
    keys: getRandomStatNames(random(1, 2)),
    pool: random(15,30),
    qualitySort: 1,
    cost: 5,
  },
  fine: {
    keys: getRandomStatNames(random(1, 3)),
    pool: random(25,50),
    qualitySort: 2,
    cost: 15,
  },
  rare: {
    keys: getRandomStatNames(random(2, 3)),
    pool: random(40,80),
    qualitySort: 3,
    cost: 40,
  },
  epic: {
    keys: getRandomStatNames(random(2, 3)),
    pool: random(65,130),
    qualitySort: 4,
    cost: 90,
  },
  legendary: {
    keys: getRandomStatNames(random(3, 4)),
    pool: random(110,220),
    qualitySort: 5,
    cost: 200,
  }
});

const getRandomCategory = () => sample(Categories);
const getIcon = (category:string) => `${category}_${random(1, { amulet: 3, armor: 30, axe: 40, bow: 6, gem: 10, helmet: 50, misc: 12, staff: 3, sword: 24 }[category])}`;
const getQuality = (roll = Math.random()) => ((roll < 0.01) ? "legendary" : (roll < 0.1) ? "epic" : (roll < 0.3) ? "rare" : (roll < 0.6) ? "fine" : "common");
const getSet = (category:string) => findKey({ amulet: ["amulet", "gem", "misc"], body: ["armor"], helm: ["helmet"], weapon: ["axe", "bow", "staff", "sword"] }, c => c.includes(category));

const allocateStatIterator = (pool:number, length:number) => {
  let count = 0;
  const statIterator = {
    next: (key: string) => {
      const range = 1/(length * 2); // E.g 2 stats = 50% mid way so range is from 25% to 75%.
      const deduction = Math.round( pool * random(range, range * 3)); // Percentage of lower to upper range.
      if (count < length-1) {
        pool -= deduction;
        count++;
        return { value: deduction, done: false, key };
      }
      return { value: pool, done: true, key };
    }
  };
  return statIterator;
}

const getStats = (qualityType:QualityLevel) => {
  const keys = qualityType.keys;
  const pool = qualityType.pool;
  const it = allocateStatIterator(pool, keys.length);
  return keys.map(key => ({
    id: uuidv4(),
    name: key,
    value: it.next(key).value
  }))
}

export const generateItem = (data?:Schema) => {
  const qualityMap:QualityMap = getQualityMap();
  const generated:IMagicItemGenerateProps = FCG.MagicItems.generate();
  const name = data?.name || generated.formattedData.title;
  const category = data?.category || getRandomCategory();
  const set = data?.set || getSet(category);
  const quality = data?.quality || getQuality();
  const qualitySort = data?.qualitySort || qualityMap[quality].qualitySort;
  const cost = data?.cost || qualityMap[quality].cost;
  const pool = data?.pool || qualityMap[quality].pool;
  const icon = data?.icon || getIcon(category);
  const stats = data?.stats.map((s = {}) => ({...s, id: uuidv4()})) || getStats(qualityMap[quality]);

  return {...data, name, category, set, quality, qualitySort, cost, pool, icon, stats};
}