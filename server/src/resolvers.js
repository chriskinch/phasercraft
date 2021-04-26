module.exports = {
    Query: {
        items: (_, { orderBy, filter }, { dataSources }) => dataSources.itemAPI.getAllItems({ orderBy }),
        item: (_, { id }, { dataSources }) => dataSources.itemAPI.getItemById({ itemId: id }),
    },
    Mutation: {
        postItem: async (_, item, { dataSources }) => dataSources.itemAPI.postItem(item),
        removeItem: async (_, { id }, { dataSources }) => dataSources.itemAPI.deleteItem({ removeItemId: id }),
    },
};