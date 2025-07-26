type ClassType = "warrior" | "cleric" | "mage" | "occultist" | "ranger";
type SchoolType = "arcane" | "fire" | "light" | "frost" | "earth" | "dark";
type AscendedClassType = "knight" | "paladin" | "enchanter" | "death knight" | "warden" | 
  "priest" | "elementalist" | "monk" | "druid" | "wizard" | "warlock" | "conjurer" | 
  "necromancer" | "assassin" | "hunter";
type AscendedSchoolType = "divine" | "holy" | "cryo" | "smite" | "nature" | "ki" | "flare" | 
  "water" | "beam" | "lava" | "blood" | "ice" | "time" | "stone" | "undead" | "lightning" | 
  "fortify" | "shadow" | "obsidian" | "poison" | "death";

const class_schools: Record<ClassType, SchoolType[]> = {
  "warrior": ["arcane", "fire"],
  "cleric": ["light", "fire"],
  "mage": ["fire", "frost", "arcane", "earth"],
  "occultist": ["frost", "dark"],
  "ranger": ["arcane", "earth"]
};

const ascended_classes: Record<AscendedClassType, [ClassType, ClassType]> = {
  "knight": ["warrior", "warrior"],
  "paladin": ["cleric", "warrior"],
  "enchanter": ["mage", "warrior"],
  "death knight": ["occultist", "warrior"],
  "warden": ["ranger", "warrior"],
  "priest": ["cleric", "cleric"],
  "elementalist": ["cleric", "mage"],
  "monk": ["cleric", "occultist"],
  "druid": ["cleric", "ranger"],
  "wizard": ["mage", "mage"],
  "warlock": ["mage", "occultist"],
  "conjurer": ["mage", "ranger"],
  "necromancer": ["occultist", "occultist"],
  "assassin": ["occultist", "ranger"],
  "hunter": ["ranger", "ranger"]
};

const ascended_schools: Record<AscendedSchoolType, [SchoolType, SchoolType]> = {
  "divine": ["light", "light"],
  "holy": ["light", "fire"],
  "cryo": ["light", "frost"],
  "smite": ["light", "arcane"],
  "nature": ["light", "earth"],
  "ki": ["light", "dark"],
  "flare": ["fire", "fire"],
  "water": ["fire", "frost"],
  "beam": ["fire", "arcane"],
  "lava": ["fire", "earth"],
  "blood": ["fire", "dark"],
  "ice": ["frost", "frost"],
  "time": ["frost", "arcane"],
  "stone": ["frost", "earth"],
  "undead": ["frost", "dark"],
  "lightning": ["arcane", "arcane"],
  "fortify": ["arcane", "earth"],
  "shadow": ["arcane", "dark"],
  "obsidian": ["earth", "earth"],
  "poison": ["earth", "dark"],
  "death": ["dark", "dark"]
};

export function matchAscended(a: string[], b: string[]): boolean {
  return a.sort().join() === b.sort().join();
}

export function getSpellSchools(type: ClassType | AscendedClassType): string[] {
  if (class_schools.hasOwnProperty(type)) {
    return class_schools[type as ClassType];
  } else if (ascended_classes.hasOwnProperty(type)) {
    return getAscendedSchools(type as AscendedClassType);
  } else {
    throw new Error("Error: Not a valid class or ascended class!");
  }
}

export function getAscendedClass(types: ClassType[]): AscendedClassType | null {
  for (const ascended in ascended_classes) {
    if (matchAscended(ascended_classes[ascended as AscendedClassType], types)) {
      return ascended as AscendedClassType;
    }
  }
  return null;
}

export function getAscendedSchools(type: AscendedClassType): string[] {
  const primary_spells = class_schools[ascended_classes[type][0]];
  const secondary_spells = class_schools[ascended_classes[type][1]];

  const spell_map = primary_spells.map(ps => secondary_spells.map(ss => [ps, ss]));
  const spells_combos = spell_map.flat();

  const spells = spells_combos.map(spell => {
    for (const ascended in ascended_schools) {
      if (matchAscended(ascended_schools[ascended as AscendedSchoolType], spell)) {
        return ascended;
      }
    }
    return null;
  });

  return uniqEs6(spells.concat(secondary_spells).concat(primary_spells).sort());
}

function uniqEs6(arrArg: (string | null)[]): string[] {
  return arrArg.filter((elem, pos, arr) => {
    return elem !== null && arr.indexOf(elem) === pos;
  }) as string[];
}