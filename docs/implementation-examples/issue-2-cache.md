# Example implementation: #2 — stale-safe GitHub cache

This file is a reference implementation note for [#2](https://github.com/airlinklabs/home/issues/2). It is deliberately kept out of the production code path. The goal is to show the shape of the fix before applying it to `src/scripts/cache-github.ts` and `.github/workflows/deploy.yml`.

## Target architecture

```text
GitHub API
   |
   +--> conditional request (ETag / Last-Modified)
   |
   +--> bounded fetch queue
   |
   v
source result { status, fetchedAt, etag, value, error }
   |
   +--> merge with last-known-good source data
   |
   v
versioned JSON snapshot
   |
   +--> build consumes snapshot
   +--> UI receives freshness metadata
```

## Core rules

1. A successful response replaces the source snapshot.
2. A `304 Not Modified` refreshes `fetchedAt` without replacing the payload.
3. A failed request keeps the previous payload and records the failure.
4. An empty response is only accepted when the source is legitimately empty and the request itself succeeded.
5. Each source has its own freshness, so one failing endpoint does not poison the whole cache.
6. The cache writer writes atomically: generate a temporary JSON file, validate it, then rename it over the old snapshot.

## Suggested types

```ts
type CacheStatus = 'fresh' | 'stale' | 'expired' | 'unavailable';

type SourceState<T> = {
  value: T;
  fetchedAt: string;
  status: CacheStatus;
  etag?: string;
  lastModified?: string;
  lastError?: string;
};

interface GithubCache {
  schemaVersion: 2;
  generatedAt: string;
  panel: SourceState<RepositorySnapshot>;
  daemon: SourceState<RepositorySnapshot>;
  contributors: SourceState<ContributorSnapshot[]>;
  commits: SourceState<CommitSnapshot[]>;
  addons: SourceState<AddonSnapshot[]>;
}
```

## Conditional fetch pattern

```ts
async function fetchJson<T>(url: string, previous?: SourceState<T>) {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
  };

  if (previous?.etag) headers['if-none-match'] = previous.etag;
  if (previous?.lastModified) headers['if-modified-since'] = previous.lastModified;

  const response = await fetch(url, { headers });

  if (response.status === 304 && previous) {
    return {
      ...previous,
      fetchedAt: new Date().toISOString(),
      status: 'fresh' as const,
      lastError: undefined,
    };
  }

  if (!response.ok) {
    throw new Error(`GitHub ${response.status} for ${url}`);
  }

  return {
    value: (await response.json()) as T,
    fetchedAt: new Date().toISOString(),
    status: 'fresh' as const,
    etag: response.headers.get('etag') ?? undefined,
    lastModified: response.headers.get('last-modified') ?? undefined,
  };
}
```

## Bounded concurrency

Do not replace the current serial contributor loop with `Promise.all()` over an arbitrary list. Use a small queue (for example, 4–8 concurrent requests), retry only transient failures, and stop retrying when the request is clearly rate-limited or invalid.

## Freshness policy

The exact numbers should be agreed with maintainers, but the implementation should make them explicit. A reasonable starting point for a static community site is:

- `< 24h`: `fresh`
- `24h–7d`: `stale`
- `> 7d`: `expired`
- no usable value: `unavailable`

The UI should still use the last-known-good payload during `stale`, and normally also during `expired` when no newer value exists. `expired` describes trust, not a reason to erase useful data.

## Workflow behavior

The scheduled workflow should either:

- commit the regenerated cache to the branch used by Pages, or
- produce the cache as an explicit build artifact that is consumed by the Pages build.

The current half-way model should be removed. There should be one source of truth.

## Acceptance checklist

- [ ] Cache schema version is checked before use.
- [ ] Cache writes are atomic.
- [ ] Last-known-good values survive transient API failures.
- [ ] ETag / Last-Modified headers are persisted and reused.
- [ ] Contributor/addon fetching is bounded.
- [ ] Each source has independent freshness/error metadata.
- [ ] CI prints a useful freshness summary.
- [ ] No `GH_TOKEN` value can enter the generated client bundle.
