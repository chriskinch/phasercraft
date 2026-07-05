import Spell from "./Spell";

// Self-buff spells (Enrage, PowerInfusion). Casting metadata lives in each
// concrete spell's defaults (targetKind: "self"); the CastingController casts
// them on the player as soon as the button is pressed.
class Boon extends Spell {}

export default Boon;
