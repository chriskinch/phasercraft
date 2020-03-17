const CracoAlias = require("craco-alias");

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        '^dnd-core$': 'dnd-core/dist/cjs',
        '^react-dnd$': 'react-dnd/dist/cjs',
        '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
        '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
        '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
        '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs'
      }
    }
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
        }
      }
    }
  ]
};