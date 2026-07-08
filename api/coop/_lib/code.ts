import { randomInt } from "node:crypto";

// Join-code alphabet: no 0/O, 1/I/L so codes survive being read out loud or
// typed from a phone screen. 31^5 ≈ 28.6M combinations — plenty for sessions
// that live ten minutes.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export const CODE_LENGTH = 5;

export const generateJoinCode = (): string =>
    Array.from({ length: CODE_LENGTH }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

/** Canonical form for lookups (codes are generated uppercase, joiners may type lowercase). */
export const normalizeJoinCode = (raw: string): string => raw.trim().toUpperCase();

/** A code is valid if it is exactly CODE_LENGTH characters from the alphabet. */
export const isValidJoinCode = (code: string): boolean =>
    code.length === CODE_LENGTH && [...code].every((ch) => ALPHABET.includes(ch));
