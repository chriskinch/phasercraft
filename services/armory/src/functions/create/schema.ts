export const bodySchema = {
  type: "object",
  required: ["stats"],
  properties: {
    name: { 
      type: "string"
    },
    stats: {
      type: "array",
      items: { $ref: "#/$defs/stats" },
      minItems: 1,
      maxItems: 10,
      uniqueItems: true
    }
  }
} as const;

export const schema = {
  type: "object",
  properties: {
    body: bodySchema
  },
  $defs: {
    stats: {
      type: "object",
      properties: {
        attack_power: {
          type: "number"
        },
        attack_speed: {
          type: "number"
        },
        magic_power: {
          type: "number"
        },
        critical_chance: {
          type: "number"
        },
        speed: {
          type: "number"
        },
        defence: {
          type: "number"
        },
        health_max: {
          type: "number"
        },
        health_max_rate: {
          type: "number"
        },
        health_regen_rate: {
          type: "number"
        },
        health_regen_value: {
          type: "number"
        },
      }
    }
  }
} as const;