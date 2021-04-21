const { RESTDataSource } = require('apollo-datasource-rest');

const sortKeys = Object.freeze({
  pool: 'pool',
  quality: 'qualitySort',
});

class ItemAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3001/dev';
    // this.baseURL = 'https://sro42uvs8l.execute-api.us-east-1.amazonaws.com/dev';
  }

  async getAllItems({orderBy}) {
    const response = await this.get('items');
    
    if(orderBy) {
      const key = Object.keys(orderBy)[0];
      const sortKey = sortKeys[Object.keys(orderBy)[0]];
      if(orderBy[key] === "asc") response.sort((a, b) => a[sortKey] - b[sortKey]);
      if(orderBy[key] === "desc") response.sort((a, b) => b[sortKey] - a[sortKey]);
    }
    
    return Array.isArray(response)
      ? response.map(item => this.itemReducer(item))
      : [];
  }

  async getItemById({itemId}) {
    const response = await this.get(`items/${itemId}`);
    return this.itemReducer(response);
  }

  async postItem(item) {
    const response = await this.post('items', item);
    return this.itemReducer(response);
  }

  itemReducer({id, name, category, set, icon, quality, cost, pool, stats}) {
    if(!id) throw new Error('ID does not exist!');

    return {
      id,
      name,
      category,
      set,
      icon,
      quality,
      cost,
      pool,
      stats,
    };
  }

  async deleteItem({removeItemId}) {
    const response = await this.delete(`items/${removeItemId}`);
    return this.itemReducer(response);
  }

}

module.exports = ItemAPI;