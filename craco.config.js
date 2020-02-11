const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        baseUrl: "./src",
        aliases: {
            "@config": "./Config",
            "@entities": "./Entities",
            "@graphics": "./Graphics",
            "@helpers": "./Helpers",
            "@scenes": "./Scenes",
            "@store": "./store",
            "@ui": "./UI",
        }
      }
    }
  ]
};