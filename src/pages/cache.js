import { InMemoryCache } from '@apollo/client';

const qualityColors = Object.freeze({
    common: "#bbbbbb",
    fine: "#00dd00",
    rare: "#0077ff",
    epic: "#9900ff",
    legendary: "#ff9900"
});

const statShortNames = Object.freeze({
    attack_power: "AP",
    attack_speed: "AS",
    critical_chance: "C",
    defence: "D",
    health_max: "H",
    health_regen_rate: "RR",
    health_regen_value: "RV",
    magic_power: "MP",
    speed: "S"
});

const adjusted = (key, value) => {
    switch (key) {
        case "attack_power":
            return value/2;
        case "attack_speed":
            return -value/1000;
        case "critical_chance":
            return value/10;
        case "defence":
            return value/2;
        case "health_max":
            return value*4;
        case "health_regen_rate":
            return -value/1000;
        case "health_regen_value":
            return value/10;
        case "magic_power":
            return value/2;
        case "speed":
            return value/10;
        default:
            console.log(`No adjustment for [${key}] found.`)
            return value;
    }
}

const formatted = (key, value) => {
    let format;
    switch(key) {
        // These are rounded percentages (by the way... WTF is EPSILON???)
        case 'attack_speed':
        case 'critical_chance':
        case 'health_regen_rate':
            format = `${ Math.ceil((value + Number.EPSILON) * 100) / 100 }%`;
            break;
        // Otherwise it's just rounded
        default:
            format = Math.ceil(value)
    }
    return format;
}

export const cache = new InMemoryCache({
    typePolicies: {
        Item: {
            fields: {
                color: {
                    read(_, {readField}) {
                        return qualityColors[readField('quality')];
                    }
                }
            }
        },
        Stat: {
            fields: {
                adjusted: {
                    read(_, {readField}) { 
                        return adjusted(readField('name'), readField('value'))
                    }
                },
                formatted: {
                    read(_, {readField}) { 
                        return formatted(readField('name'), readField('converted'))
                    }
                },
                abbreviation: {
                    read(_, {readField}) { 
                        return statShortNames[readField('name')];
                    }
                }                
            }
        }
    }
}); 