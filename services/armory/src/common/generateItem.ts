import { v4 as uuidv4 } from 'uuid';
import { Categories, Qualities, Stats } from './constants';
import { findKey, random, sample, sampleSize } from 'lodash';

import type { FromSchema } from "json-schema-to-ts";
import { bodySchema, schema } from '../functions/create/schema';

import * as FCG from "fantasy-content-generator";

type ItemSchema = FromSchema<typeof bodySchema>;


type Category = typeof Categories[keyof typeof Categories];
type Stat = keyof typeof Stats;

interface QualityMap {
  [key:string]: QualityLevel
}

type StatGroup = {
  [key in Stats]?: Required<number>
}

interface QualityLevel {
  keys: Stat[],
  pool: number,
  qualitySort: number,
  cost: number
};

interface AssignedStat {
  id: string
  name: Stat,
  value: number
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

const thing = { amulet: 3, armor: 30, axe: 40, bow: 6, gem: 10, helmet: 50, misc: 12, staff: 3, sword: 24 };

const getRandomCategory = () => sample(Categories);
const getIcon = (category:string, thing:number) => `${category}_${random(1, thing, false)}`;
const getQuality = (roll = Math.random()) => ((roll < 0.01) ? "legendary" : (roll < 0.1) ? "epic" : (roll < 0.3) ? "rare" : (roll < 0.6) ? "fine" : "common");
const getSet = (category:string) => findKey({ amulet: ["amulet", "gem", "misc"], body: ["armor"], helm: ["helmet"], weapon: ["axe", "bow", "staff", "sword"] }, c => c.includes(category));

const allocateStatIterator = (pool:number, length:number) => {
  let count = 0;
  const statIterator = {
    next: (key:Stat) => {
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

const getStats = (qualityType:QualityLevel): AssignedStat[] => {
  const keys = qualityType.keys;
  const pool = qualityType.pool;
  const it = allocateStatIterator(pool, keys.length);
  return keys.map(key => ({
    id: uuidv4(),
    name: key,
    value: it.next(key).value
  }))
}

const addStatIds = (stats:StatGroup): AssignedStat[] => {
  const keys = Object.keys(stats) as Stat[];
  return keys.map(key => ({
    id: uuidv4(),
    name: key,
    value: stats[key]!
  }))
}

export const generateItem = (data?:ItemSchema) => {
  const qualityMap:QualityMap = getQualityMap();
  const generated:IMagicItemGenerateProps = FCG.MagicItems.generate();
  const name = data?.name || generated.formattedData.title;
  const category = data?.category || getRandomCategory()!;
  const set = data?.set || getSet(category);
  const quality = data?.quality || getQuality();
  const qualityLevel = qualityMap[quality!];
  const qualitySort = data?.qualitySort || qualityLevel.qualitySort;
  const cost = data?.cost || qualityLevel.cost;
  const pool = data?.pool || qualityLevel.pool;
  const categoryMax:number = thing[category];
  const icon = data?.icon || getIcon(category, categoryMax);
  const stats = data?.stats ? addStatIds(data.stats) : getStats(qualityLevel);

  console.log(data?.stats, stats)
  return {...data, name, category, set, quality, qualitySort, cost, pool, icon, stats};
}