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
    return {
        attack_power: (v) => v/2,
        attack_speed: (v) => -v/1000,
        critical_chance: (v) => v/10,
        defence: (v) => v/2,
        health_max: (v) => v*4,
        health_regen_rate: (v) => -v/1000,
        health_regen_value: (v) => v/10,
        magic_power: (v) => v/2,
        speed: (v) => v/10,
        default: (v) => v
    }[key](value);
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