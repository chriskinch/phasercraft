import { InMemoryCache } from '@apollo/client';

const qualityColors = Object.freeze({
    common: "#bbbbbb",
    fine: "#00dd00",
    rare: "#0077ff",
    epic: "#9900ff",
    legendary: "#ff9900",
});

export const cache = new InMemoryCache({
    typePolicies: {
        Item: {
            fields: {
                color: {
                    read(_, {readField}) {
                        return qualityColors[readField('quality')];
                    }
                },
            }
        }
    }
}); 