<!--
title: 'AWS Serverless REST API with DynamoDB and offline support example in NodeJS'
description: 'This example demonstrates how to run a service locally, using the ''serverless-offline'' plugin. It provides a REST API to manage Todos stored in DynamoDB.'
layout: Doc
framework: v1
platform: AWS
language: nodeJS
authorLink: 'https://github.com/adambrgmn'
authorName: 'Adam Bergman'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13746650?v=4&s=140'
-->
# Serverless REST API with DynamoDB and offline support

This example demonstrates how to run a service locally, using the
[serverless-offline](https://github.com/dherault/serverless-offline) plugin. It
provides a REST API to manage Todos stored in a DynamoDB, similar to the
[aws-node-rest-api-with-dynamodb](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb)
example. A local DynamoDB instance is provided by the
[serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
plugin.

## Use-case

Test your service locally, without having to deploy it first.

## Setup

```bash
npm install
serverless dynamodb install (or to use a persistent docker dynamodb instead, open a new terminal: cd ./dynamodb && docker-compose up -d)
serverless offline start
serverless dynamodb migrate (this imports schema)
```

## Run service offline

```bash
serverless offline start
```

## Usage

You can clearStore, createStore, create, delete, get or list items with the following commands:

### Clear store of all items

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3001/dev/clearStore
```

### Create a store with an amount of items

```bash
# Replace the <amount> (Default: 45) with a number to create that many random items.
curl -X POST -H "Content-Type:application/json" -d '{ "amount": 45}' http://localhost:3001/dev/createStore
```

### Create an item with either random or defined attributes
[Schema](./src/functions/create/schema.ts)
```bash
# Attributes are created at random. See the schema for a list of customisable keys.
curl -X POST -H "Content-Type:application/json" -d '{ "name": "Pick of Destiny"}' http://localhost:3001/dev/items
```

### Create an item

```bash
# Replace <id> with an item ID
curl -X DELETE -H "Content-Type:application/json" http://localhost:3001/dev/items/<id>
```

### Get an item

```bash
# Replace <id> with an item ID
curl -X GET -H "Content-Type:application/json" http://localhost:3001/dev/items/<id>
```

### List all items in the store

```bash
curl -X GET -H "Content-Type:application/json" http://localhost:3001/dev/items
```

No output
