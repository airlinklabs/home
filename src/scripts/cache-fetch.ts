import fs from 'fs-extra';
import path from 'path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '../../');
const STORE = path.join(ROOT, 'data', 'github-cache', 'http');
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const CONCURRENCY = 6;

type Entry = { fetchedAt: number; etag?: string; lastModified?: string; body: string };

let active = 0;
const queue: (() => void)[] = [];

async function limit<T>(job: () => Promise<T>): Promise<T> {
  if (active >= CONCURRENCY) await new Promise<void>(resolve => queue.push(resolve));
  active++;
  try { return await job(); }
  finally {
    active--;
    queue.shift()?.();
  }
}

function keyFor(url: string) {
  return Buffer.from(url).toString('base64url').replace(/=+$/g, '');
}

async function readEntry(url: string): Promise<Entry | null> {
  try { return await fs.readJson(path.join(STORE, `${keyFor(url)}.json`)) as Entry; }
  catch { return null; }
}

async function writeEntry(url: string, entry: Entry) {
  await fs.ensureDir(STORE);
  const file = path.join(STORE, `${keyFor(url)}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeJson(tmp, entry, { spaces: 0 });
  await fs.move(tmp, file, { overwrite: true });
}

export async function cachedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return limit(async () => {
    const cached = await readEntry(url);
    const headers = new Headers(init.headers);
    headers.set('Accept', headers.get('Accept') || 'application/vnd.github+json');
    headers.set('X-GitHub-Api-Version', headers.get('X-GitHub-Api-Version') || '2022-11-28');
    if (cached?.etag) headers.set('If-None-Match', cached.etag);
    if (cached?.lastModified) headers.set('If-Modified-Since', cached.lastModified);

    try {
      const response = await fetch(url, { ...init, headers });
      if (response.status === 304 && cached) {
        return new Response(cached.body, { status: 200, headers: { 'content-type': 'application/json' } });
      }
      if (response.ok) {
        const body = await response.text();
        await writeEntry(url, {
          fetchedAt: Date.now(),
          etag: response.headers.get('etag') || undefined,
          lastModified: response.headers.get('last-modified') || undefined,
          body,
        });
        return new Response(body, { status: response.status, headers: response.headers });
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (cached && Date.now() - cached.fetchedAt < MAX_AGE_MS) {
        console.warn(`cache fallback: ${url} (${(error as Error).message})`);
        return new Response(cached.body, { status: 200, headers: { 'content-type': 'application/json', 'x-airlink-cache': 'stale' } });
      }
      throw error;
    }
  });
}
