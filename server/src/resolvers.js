module.exports = {
    Query: {
        items: (_, { orderBy, filter }, { dataSources }) => dataSources.itemAPI.getAllItems({ orderBy, filter }),
        item: (_, { id }, { dataSources }) => dataSources.itemAPI.getItemById({ itemId: id }),
    },
    Mutation: {
        postItem: async (_, item, { dataSources }) => dataSources.itemAPI.postItem(item),
        removeItem: async (_, { id }, { dataSources }) => dataSources.itemAPI.deleteItem({ removeItemId: id }),
        clearStore: async (_, __, { dataSources }) => dataSources.itemAPI.clearStore(),
        stockStore: async (_, { amount }, { dataSources }) => dataSources.itemAPI.stockStore({ amount }),
        restockStore: async (_, { amount }, { dataSources }) => dataSources.itemAPI.restockStore({ amount })
    },
};