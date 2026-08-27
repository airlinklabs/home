import { cachedFetch } from './cache-fetch.js';

const nativeFetch = globalThis.fetch;
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => cachedFetch(String(input), init)) as typeof nativeFetch;

await import('./cache-github.js');
