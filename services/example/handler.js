const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
// const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

app.use(express.json());

app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, character, showHUD, menu } = Item;
      res.json({ userId, character, showHUD, menu });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  const { userId } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      character: req.body.character,
      showHUD: req.body.showHUD,
      showUi: req.body.showUi,
      menu: req.body.menu,
      base_stats: req.body.base_stats,
      stats: req.body.stats,
      level: req.body.level,
      loot: req.body.loot,
      filters: req.body.filters,
      inventory: req.body.inventory,
      equipment: {
          amulet: req.body.equipment.amulet,
          body: req.body.equipment.body,
          helm: req.body.equipment.helm,
          weapon: req.body.equipment.weapon,
      },
      coins: req.body.coins,
      selected: req.body.selected,
      saveSlot: req.body.saveSlot,
      wave: req.body.wave,
      xp: req.body.xp,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
