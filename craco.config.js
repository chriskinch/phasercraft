const path = require("path");
const fs = require("fs");
const CracoAlias = require("craco-alias");
const rewireBabelLoader = require("craco-babel-loader");

// helpers

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = { 
  babel: {
    loaderOptions: {
      babelrc: true,
    },
  },
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
            "@mutations": "./src/UI/operations/mutations",
            "@queries": "./src/UI/operations/queries",
        }
      }
    }
  ]
};