# Example implementation: #9 — keep the technical feel without paying for unnecessary work

Reference for [#9](https://github.com/airlinklabs/home/issues/9).

## Performance priorities

1. Remove global transitions.
2. Stop continuous canvas work when the page/component is not visible.
3. Reduce expensive blur/filter effects, especially during loading.
4. Do not delay navigation for decorative animations.
5. Make all third-party runtime data optional and explicit.
6. Give images intrinsic dimensions and sensible loading priority.

## Canvas strategy

If the animated background remains, use `IntersectionObserver` and page visibility to stop work when the effect is off-screen or the tab is hidden. Use `prefers-reduced-motion` as a hard opt-out.

```ts
const media = matchMedia('(prefers-reduced-motion: reduce)');
let visible = true;
let frame = 0;

function tick() {
  if (!visible || media.matches) return;
  // draw one frame
  frame = requestAnimationFrame(tick);
}
```

For mobile, lower density rather than simply shrinking the same expensive workload.

## Loading overlay

The loader should be a lightweight state, not a full visual effect stack. Avoid large backdrop blur + turbulence just to indicate that a static document is loading.

## Third-party counter

Treat the install counter as a non-critical enhancement. It needs a timeout, an explicit unavailable state, and should never delay the main content. Prefer integrating it into the build/cache pipeline if the metric is genuinely worth keeping.

## Image loading

Above-the-fold images should be prioritized deliberately. Secondary screenshots and avatars may be lazy loaded. Avoid loading two equivalent theme assets when only one can be selected with media/CSS/appropriate markup.

## Acceptance checklist

- [ ] Global transitions removed.
- [ ] Canvas animation pauses when hidden/off-screen.
- [ ] Reduced-motion disables animated canvas work.
- [ ] Loading visuals are cheap.
- [ ] Navigation is not held for decoration.
- [ ] Third-party metrics cannot block the page.
- [ ] Images have intrinsic dimensions/loading priority.
- [ ] Performance is checked on a low-end mobile profile.
