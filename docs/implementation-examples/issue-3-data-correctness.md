# Example implementation: #3 — make the data contract explicit

Reference for [#3](https://github.com/airlinklabs/home/issues/3). This PR is intentionally a guide, not a production fix.

## The important rule

The writer and reader must share one typed schema. Do not create an XML shape in one file and reconstruct it with regexes somewhere else.

```ts
export interface CommitSnapshot {
  repository: 'panel' | 'daemon';
  sha: string;
  url: string;
  author: { login: string; name: string; avatarUrl?: string } | null;
  committedAt: string;
  subject: string;
}

export interface RepositorySnapshot {
  name: 'panel' | 'daemon';
  stars: number;
  forks: number;
  openIssues: number;
  latestRelease: { tag: string; publishedAt: string } | null;
  latestCommitAt: string | null;
}
```

## Data normalization

Normalize GitHub payloads once in the cache layer. The template should never know whether GitHub called a field `login`, `name`, `commit.author`, `published_at`, or something else.

For commits:

1. extract the subject from the first line of the commit message;
2. discard or mark bots according to one documented rule;
3. attach `panel`/`daemon` repository identity;
4. sort all commits by `committedAt` descending;
5. slice only after the merge/sort step.

This prevents the current "take 10 from each repo, then render" problem.

## Missing data

Do not overload zero with missing values. `0 stars` is valid; `null` means unavailable. The same distinction applies to release dates, contributor profiles, and install counts.

## Freshness

The cache should expose `asOf` for each metric group. The template can then render something like:

```text
GitHub data · updated 6h ago
```

and provide the exact timestamp through a `time[datetime]` element.

## Acceptance checklist

- [ ] Writer and reader use the same typed shape.
- [ ] No regex XML parser remains for structured cache data.
- [ ] Contributors, commits and addons retain names correctly.
- [ ] Activity is globally chronological.
- [ ] Missing data is not rendered as zero.
- [ ] Repository identity is explicit on every activity row.
- [ ] Bot filtering is documented.
- [ ] Every metric group has an `asOf` timestamp.
