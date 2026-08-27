# Example implementation: #5 — activity as project health

Reference for [#5](https://github.com/airlinklabs/home/issues/5).

## Recommended information model

Do not build a generic analytics dashboard. Use the existing AirLink technical style to present a compact evidence panel.

```text
Project health

Panel                         Daemon
vX.Y.Z                       vX.Y.Z
12.4k stars                  3.1k stars
42 forks                     18 forks
7 open issues                2 open issues
released 3d ago              released 11d ago
active 4h ago                active 1d ago

Recent activity
[Panel] fix: ...             alice · 4h ago
[Daemon] feat: ...           bob · 1d ago
```

## Data rules

- repository-level metrics stay repository-level;
- combined numbers are explicitly labelled as combined;
- commit feed is globally sorted by commit date;
- each row shows repository, author and time without opening a modal;
- commit message uses the subject line, not the full body;
- latest release and latest commit are separate facts;
- cache freshness is always visible.

## Freshness states

```ts
type DataState = 'fresh' | 'stale' | 'unavailable';
```

Fresh data should look normal. Stale data should retain the payload but make the age visible. Unavailable data should say so directly rather than becoming a misleading dash or zero.

## Avoid

Do not introduce oversized KPI tiles, fake scores, percentages that cannot be derived from the source data, or a health number with no defensible definition. The goal is decision support, not dashboard theater.

## Acceptance checklist

- [ ] Panel and Daemon are distinguishable.
- [ ] Feed is globally chronological.
- [ ] Every activity item has repository + author + time.
- [ ] Release and commit recency are distinct.
- [ ] Stale and unavailable states are obvious.
- [ ] No invented metrics.
