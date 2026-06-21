// Shared *structural* contract for the Armory REST API.
//
// Parity rule (agreed 2026-06-21): the new Vercel armory must return the same
// response SHAPE as the legacy AWS armory — identical mandatory/optional fields
// and types. Values may differ (items are randomly generated), so the contract
// describes structure only, never concrete values.
//
// This module is the single yardstick used twice:
//   - PR1 (this phase): characterise the legacy endpoint (recorded fixtures +
//     an opt-in live check) so we have a verified baseline.
//   - PR2: assert the new `/api/armory/*` handlers return the same shape.
//
// It is intentionally dependency-free (no zod/ajv) so it can be imported from
// either the frontend test suite or the API package without adding deps.

export type Shape =
    | { kind: "string"; optional?: boolean }
    | { kind: "number"; optional?: boolean }
    | { kind: "boolean"; optional?: boolean }
    | { kind: "object"; fields: Record<string, Shape>; optional?: boolean }
    | { kind: "array"; of: Shape; optional?: boolean };

export const str = (optional = false): Shape => ({ kind: "string", optional });
export const num = (optional = false): Shape => ({ kind: "number", optional });
export const bool = (optional = false): Shape => ({ kind: "boolean", optional });
export const obj = (fields: Record<string, Shape>, optional = false): Shape => ({
    kind: "object",
    fields,
    optional,
});
export const arr = (of: Shape, optional = false): Shape => ({ kind: "array", of, optional });

/**
 * Validate a value against a {@link Shape}. Returns a list of human-readable
 * mismatch messages — an empty array means the value conforms exactly.
 *
 * Validation is STRICT: unexpected object keys are reported, so the new API
 * cannot silently add or rename fields and still pass.
 */
export const validate = (shape: Shape, value: unknown, path = "$"): string[] => {
    switch (shape.kind) {
        case "string":
        case "number":
        case "boolean": {
            if (typeof value !== shape.kind) {
                return [`${path}: expected ${shape.kind}, got ${describe(value)}`];
            }
            return [];
        }
        case "array": {
            if (!Array.isArray(value)) {
                return [`${path}: expected array, got ${describe(value)}`];
            }
            return value.flatMap((item, i) => validate(shape.of, item, `${path}[${i}]`));
        }
        case "object": {
            if (typeof value !== "object" || value === null || Array.isArray(value)) {
                return [`${path}: expected object, got ${describe(value)}`];
            }
            const record = value as Record<string, unknown>;
            const errors: string[] = [];

            for (const [key, fieldShape] of Object.entries(shape.fields)) {
                const has = Object.prototype.hasOwnProperty.call(record, key);
                if (!has) {
                    if (!fieldShape.optional) errors.push(`${path}.${key}: missing required field`);
                    continue;
                }
                errors.push(...validate(fieldShape, record[key], `${path}.${key}`));
            }

            for (const key of Object.keys(record)) {
                if (!(key in shape.fields)) errors.push(`${path}.${key}: unexpected field`);
            }
            return errors;
        }
    }
};

const describe = (value: unknown): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
};

// --- The Armory contract -----------------------------------------------------

export const statContract: Shape = obj({
    id: str(),
    name: str(),
    value: num(),
});

export const itemContract: Shape = obj({
    id: str(),
    // Persisted timestamp set by the create/createStore handlers; present on
    // every legacy response, so the new API must include it too.
    createdAt: num(),
    name: str(),
    category: str(),
    set: str(),
    quality: str(),
    qualitySort: num(),
    cost: num(),
    pool: num(),
    icon: str(),
    stats: arr(statContract),
});

export const itemListContract: Shape = arr(itemContract);
