const { RESTDataSource } = require('apollo-datasource-rest');

class ItemAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://s4rgk3dk65.execute-api.us-east-1.amazonaws.com/dev/';
  }

  async getAllItems() {
    const response = await this.get('users');
    return Array.isArray(response)
      ? response.map(user => this.itemReducer(user))
      : [];
  }

  itemReducer(launch) {
    console.log(launch)
    return {
      name: launch.mission_name,
      category: launch.mission_name,
      icon: launch.mission_name,
      quality: {
        name: launch.mission_name,
        pool: 100,
      },
    };
  }
}

module.exports = ItemAPI;