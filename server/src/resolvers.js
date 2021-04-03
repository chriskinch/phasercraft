module.exports = {
    Query: {
        items: (_, __, { dataSources }) => dataSources.itemAPI.getAllItems(),
    }
};