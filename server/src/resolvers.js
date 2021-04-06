module.exports = {
    Query: {
        items: (_, __, { dataSources }) => dataSources.itemAPI.getAllItems(),
        item: (_, { id }, { dataSources }) => dataSources.itemAPI.getItemById({ itemId: id }),
    },
    Mutation: {
        removeItem: async (_, { id }, { dataSources }) => dataSources.itemAPI.deleteItem({ removeItemId: id }),
    },
};