# Example implementation: #7 — split the homepage by responsibility

Reference for [#7](https://github.com/airlinklabs/home/issues/7).

## Proposed template layout

```text
src/templates/
  index.ejs
  partials/
    nav.ejs
    footer.ejs
    hero.ejs
    features.ejs
    install.ejs
    activity.ejs
    community.ejs
    dialogs.ejs
```

`index.ejs` should compose sections and pass prepared data. It should not contain business logic, API calls, large data transforms, or inline event handlers.

## Proposed client modules

```text
public/js/
  main.js
  navigation.js
  dialogs.js
  features.js
  install.js
  activity.js
  theme.js
```

Each module gets a narrow responsibility and initializes only when its target exists.

## Tokens

Build on the existing monochrome system with semantic roles:

```css
:root {
  --color-bg: ...;
  --color-surface: ...;
  --color-border: ...;
  --color-text: ...;
  --color-muted: ...;
  --color-focus: ...;
  --space-1: ...;
  --space-2: ...;
  --space-3: ...;
  --radius-sm: ...;
  --radius-md: ...;
  --motion-fast: ...;
  --motion-normal: ...;
}
```

Components consume roles rather than reaching directly for arbitrary values.

## Refactor rule

Do not create abstractions merely to make the file count larger. Extract code when the extraction gives a meaningful responsibility, improves testability, or prevents duplicated presentation logic.

The global `* { transition: ... }` approach should be removed. Transitions belong to interactive components and should animate only properties that need to change.

## Acceptance checklist

- [ ] `index.ejs` is composition + data binding, not application logic.
- [ ] Homepage sections are separate partials.
- [ ] Inline handlers are gone.
- [ ] Client behavior is split by responsibility.
- [ ] Tokens cover semantic color, spacing, type, radius and motion.
- [ ] Global transitions are removed.
- [ ] Build output stays static/GitHub Pages compatible.
