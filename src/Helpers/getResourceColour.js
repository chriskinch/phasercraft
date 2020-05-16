export default function getResourceColour(type){
    const t = type.toLowerCase();
    return (
        t === "health" ? "green" :
        t === "mana" ? "blue" :
        t === "rage" ? "red" :
        t === "energy" ? "yellow" :
        "white"
    )
}