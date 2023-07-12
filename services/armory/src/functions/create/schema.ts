export const bodySchema = {
  type: "object",
  properties: {
    category: { 
      type: "string",
      enum: ["amulet", "armor", "axe", "bow", "gem", "helmet", "misc", "staff", "sword"]
    },
    cost: { 
      type: "number"
    },
    icon: { 
      type: "string"
    },
    name: { 
      type: "string"
    },
    pool: { 
      type: "number"
    },
    quality: { 
      type: "string",
      enum: ["common", "fine", "rare", "epic", "legendary"],
    },
    qualitySort: { 
      type: "number"
    },
    set: { 
      type: "string"
    },
    stats: {
      type: "object",
      anyOf: [
        {
          properties: {
            attack_power: { type: "number" }
          },
          required: ["attack_power"]
        },
        {
          properties: {
            attack_speed: { type: "number" }
          },
          required: ["attack_speed"]
        },
        {
          properties: {
            magic_power: { type: "number" }
          },
          required: ["magic_power"]
        },
        {
          properties: {
            critical_chance: { type: "number" }
          },
          required: ["critical_chance"]
        },
        {
          properties: {
            speed: { type: "number" }
          },
          required: ["speed"]
        },
        {
          properties: {
            defence: { type: "number" }
          },
          required: ["defence"]
        },
        {
          properties: {
            health_max: { type: "number" }
          },
          required: ["health_max"]
        },
        {
          properties: {
            health_regen_rate: { type: "number" }
          },
          required: ["health_regen_rate"]
        },
        {
          properties: {
            health_regen_value: { type: "number" }
          },
          required: ["health_regen_value"]
        }
      ]
    }
  }
} as const;

export const schema = {
  type: "object",
  properties: {
    body: bodySchema
  }
} as const;