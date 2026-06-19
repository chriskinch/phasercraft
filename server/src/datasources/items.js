const { RESTDataSource } = require('apollo-datasource-rest');

const sortKeys = Object.freeze({
  pool: 'pool',
  quality: 'qualitySort',
});

class ItemAPI extends RESTDataSource {
  constructor() {
    super();
    if (!process.env.ARMORY_URL) {
      throw new Error('ARMORY_URL environment variable is required (set it to the Vercel Functions host, e.g. https://phasercraft.vercel.app)');
    }
    this.baseURL = process.env.ARMORY_URL;
  }

  async getAllItems({orderBy, filter}) {
    console.log('Fetching all items with orderBy:', orderBy, 'and filter:', filter);
    const response = await this.get('api/items');

    if(orderBy) {
      const key = Object.keys(orderBy)[0];
      const sortKey = sortKeys[Object.keys(orderBy)[0]];
      if(orderBy[key] === "asc") response.sort((a, b) => a[sortKey] - b[sortKey]);
      if(orderBy[key] === "desc") response.sort((a, b) => b[sortKey] - a[sortKey]);
    }

    const filtered = () => {
      return response.filter(item => {
        const stats = item.stats.map(stat => stat.name);
        return filter.stats.every(name => stats.includes(name));
      });
    }

    const result = filter ? filtered() : response;

    return Array.isArray(result)
      ? result.map(item => this.itemReducer(item))
      : [];
  }

  async getItemById({itemId}) {
    const response = await this.get(`api/items/${itemId}`);
    return this.itemReducer(response);
  }

  async postItem(item) {
    const response = await this.post('api/items', item);
    return this.itemReducer(response);
  }

  async clearStore() {
    return await this.post('api/store/clear');
  }

  async stockStore(amount) {
    const response = await this.post('api/store/create', amount);
    return Array.isArray(response)
      ? response.map(item => this.itemReducer(item))
      : [];
  }

  itemReducer({id, name, category, set, icon, quality, qualitySort, cost, pool, stats}) {
    if(!id) throw new Error('ID does not exist!');

    return {
      id,
      name,
      category,
      set,
      icon,
      quality,
      qualitySort,
      cost,
      pool,
      stats,
    };
  }

  async deleteItem({removeItemId}) {
    const response = await this.delete(`api/items/${removeItemId}`);
    return this.itemReducer(response);
  }

}

module.exports = ItemAPI;
