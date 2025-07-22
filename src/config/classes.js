const class_schools = {
	"warrior": ["arcane", "fire"],
	"cleric": ["light", "fire"],
	"mage": ["fire", "frost", "arcane", "earth"],
	"occultist": ["frost", "dark"],
	"ranger": ["arcane", "earth"]
}

const assended_classes = {
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
}

const assended_schools = {
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
}

export function matchAssended(a, b){
	if(a.sort().join() === b.sort().join()) return true;
}

export function getSpellSchools(type){
	if(class_schools.hasOwnProperty(type)) {
		return class_schools[type];
	}else if(assended_classes.hasOwnProperty(type)){
		return getAssendedSchools(type);
	}else{
		throw "Error: Not a valid class or assended class!";
	}

}

export function getAssendedClass(types){
	for(let assended in assended_classes) {
		if(matchAssended(assended_classes[assended], types)) return assended;
	}
	return null;
}

export function getAssendedSchools(type){
	let primary_spells = class_schools[assended_classes[type][0]];
	let secondary_spells = class_schools[assended_classes[type][1]];

	let spell_map = primary_spells.map(ps => secondary_spells.map(ss => [ps,ss]));
	let spells_combos = [].concat.apply([], spell_map);

	var spells = spells_combos.map(spell => {
		for(let assended in assended_schools) {
			if(matchAssended(assended_schools[assended], spell)) return assended;
		}
		return null;
	});

	return uniqEs6(spells.concat(secondary_spells).concat(primary_spells).sort());
}

function uniqEs6(arrArg){
	return arrArg.filter((elem, pos, arr) => {
		return arr.indexOf(elem) == pos;
	})
}