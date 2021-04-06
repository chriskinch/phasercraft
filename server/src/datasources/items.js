const { RESTDataSource } = require('apollo-datasource-rest');

class ItemAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3001/dev';
    // this.baseURL = 'https://sro42uvs8l.execute-api.us-east-1.amazonaws.com/dev';
  }

  async getAllItems() {
    const response = await this.get('items');
    return Array.isArray(response)
      ? response.map(item => this.itemReducer(item))
      : [];
  }

  async getItemById({itemId}) {
    const response = await this.get(`items/${itemId}`);
    return this.itemReducer(response);
  }

  itemReducer({id, name, category, icon, quality, pool, stats}) {
    if(!id) throw new Error('ID does not exist!');

    const statsArray = Object.entries(stats).map(stat => ({ 
      name: stat[0],
      value: stat[1]
    }));

    return {
      id,
      name,
      category,
      icon,
      quality: {
        name: quality,
        pool,
      },
      stats: statsArray,
    };
  }

  async deleteItem({removeItemId}) {
    const response = await this.delete(`items/${removeItemId}`);
    return this.itemReducer(response);
  }

}

module.exports = ItemAPI;