export function getResourceColour(type: string): string {
    const t = type.toLowerCase();
    switch (t) {
        case "health":
            return "green";
        case "mana":
            return "blue";
        case "rage":
            return "red";
        case "energy":
            return "yellow";
        default:
            return "white";
    }
}