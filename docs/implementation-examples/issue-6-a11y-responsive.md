# Example implementation: #6 — accessibility and responsive baseline

Reference for [#6](https://github.com/airlinklabs/home/issues/6).

## Baseline CSS

```css
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

button,
a,
input,
select,
textarea {
  min-height: 44px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Do not globally hide scrollbars. Only use a custom scroll treatment where the component is deliberately a scroll region and there is another clear affordance that more content exists.

## Dialog pattern

Prefer `<dialog>` for modal surfaces when possible. On open: focus the dialog heading or first meaningful control. Keep focus inside while it is modal. Close on Escape. Restore focus to the invoking control.

```html
<dialog aria-labelledby="commit-dialog-title">
  <h2 id="commit-dialog-title">Commit details</h2>
  ...
</dialog>
```

## Image policy

- meaningful screenshots: descriptive alt text;
- decorative background/image: `alt=""`;
- contributor avatars: alt should identify the person if the avatar is informative, otherwise decorative;
- reserve intrinsic image dimensions to reduce layout shift.

## Responsive test matrix

The finished site should be checked at 320, 375, 430, 768, 1024, and 1280+ CSS px, plus increased text size. Pay special attention to the hero, command blocks, activity rows, contributor lists, dialogs and nav.

## Acceptance checklist

- [ ] Focus is visible on every keyboard control.
- [ ] Touch targets are usable on small screens.
- [ ] Custom modals have correct focus behavior.
- [ ] Scrollbars are not globally suppressed.
- [ ] Alt text policy is deliberate.
- [ ] Reduced motion disables non-essential animation.
- [ ] No horizontal overflow across the test matrix.
