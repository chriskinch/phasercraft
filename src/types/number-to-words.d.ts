// `number-to-words` ships no type declarations and no @types package. Declare
// the small surface the app uses (Player hotkey labels). Previously imported via
// `require()` (typed `any`); the Vite migration needs a real ESM import.
declare module "number-to-words" {
    export function toWords(n: number): string;
    export function toOrdinal(n: number): string;
    export function toWordsOrdinal(n: number): string;
}
