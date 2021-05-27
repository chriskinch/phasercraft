const createToggleFilter = ({filtersVar}) => {
    return (name) => {
        const filters = filtersVar();
        filters.includes(name) ? filtersVar(filters.filter(filter => filter !== name)) : filtersVar([...filters, name]);
    }
}

export default createToggleFilter;