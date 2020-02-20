const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        baseUrl: "./",
        aliases: {
            // Phaser
            "@root": "./src",
            "@Config": "./src/Config",
            "@Entities": "./src/Entities",
            "@Graphics": "./src/Graphics",
            "@Helpers": "./src/Helpers",
            "@Scenes": "./src/Scenes",
            "@store": "./src/store",
            // React
            "@UI": "./src/UI",
            "@components": "./src/UI/components",
            "@protons": "./src/UI/components/protons",
            "@atoms": "./src/UI/components/atoms",
            "@molecules": "./src/UI/components/molecules",
            "@organisms": "./src/UI/components/organisms",
            "@templates": "./src/UI/components/templates",
        }
      }
    }
  ]
};