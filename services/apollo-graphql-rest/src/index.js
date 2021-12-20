const { ApolloServer, MockList } = require('apollo-server-lambda');
const typeDefs = require('./schema');
const casual = require('casual');
const ItemAPI = require('./datasources/items');
const resolvers = require('./resolvers');

const categories = {amulet: 3, armor: 30, axe: 40, bow: 6, gem: 10, helmet: 50, misc: 12, staff: 3, sword: 24};
const qualities = {common: [15,30], fine: [25,50], rare: [40, 80], epic: [65, 130], legendary: [110, 220]};
const stats = ["attack_power", "attack_speed", "magic_power", "critical_chance", "speed", "defence", "health_max", "health_regen_rate", "health_regen_value"];

casual.define('item', () => {
  const category = casual.random_key(categories);
  const quality = casual.random_key(qualities);
  const icon = `${category}_${casual.integer(1, categories[category])}`;
  return {
      name: casual.title,
      category,
      quality,
      icon,
      stats: () => new MockList([1,4]),
  };
});

const mocks = {
  Query: () => ({
    items: () => new MockList(100),
  }),
  Item: () => casual.item,
  Stat: () => ({
    name: () => casual.random_element(stats),
    value: () => casual.integer(1, 50),
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // mocks,
  // mockEntireSchema: false,
  dataSources: () =>({
    itemAPI: new ItemAPI(),
  })
});

const handler = server.createHandler()

module.exports = { handler }