# Example implementation: #4 — normal web navigation, same AirLink style

Reference for [#4](https://github.com/airlinklabs/home/issues/4).

## Target structure

```text
Header / navigation
Hero: what AirLink is + primary action + docs/install
Project status: version + activity + cache freshness
Features: primary capabilities, long tail behind a browsable control
Install: recommended path + prerequisites + link to full docs
Activity: project health + recent activity
Team/community: maintainers + contribution links
Footer
```

Each section gets a stable id and remains part of one document. Navigation may smooth-scroll, but must not replace the browser's scroll model.

## Navigation model

Use readable labels rather than numeric controls. Example:

```html
<nav aria-label="Primary">
  <a href="#overview">Overview</a>
  <a href="#features">Features</a>
  <a href="#install">Install</a>
  <a href="#activity">Activity</a>
  <a href="#community">Community</a>
  <a href="/docs/">Docs</a>
</nav>
```

The JS layer can enhance this with active-section observation, but the links must work without JS.

## What to remove

- global `wheel` interception;
- global arrow-key section switching;
- touchmove prevention for page navigation;
- artificial page-level loading delays;
- section replacement that breaks deep links.

## Feature explorer

Keep the interactive feature explorer, but constrain the interaction to that component. The rest of the page remains normal HTML.

## Content hierarchy

The hero should answer "what is this?" and present one obvious next action. Installation and docs should be reachable immediately. Activity should provide evidence that the project is alive rather than compete with the product proposition.

## Acceptance checklist

- [ ] Browser scrolling works normally.
- [ ] Touch scrolling works normally.
- [ ] Keyboard users can use the page without global key interception.
- [ ] Every major section has a stable anchor.
- [ ] Navigation labels describe destinations.
- [ ] Core content remains readable with JS disabled.
- [ ] Existing monochrome/technical styling is retained.
