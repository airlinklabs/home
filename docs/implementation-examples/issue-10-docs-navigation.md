# Example implementation: #10 — make home, docs and blog one site

Reference for [#10](https://github.com/airlinklabs/home/issues/10).

## Navigation contract

Use the same navigation vocabulary and active-state treatment across every generated page type. The user's current location should always be visible.

```text
Overview · Features · Install · Activity · Community · Docs
```

The actual links should be generated through the existing `rootPrefix` mechanism so they work under the repository's GitHub Pages base path.

## Docs information architecture

Organize around user intent rather than source-file order:

```text
Docs
├── Quickstart
├── Installation
├── Architecture
├── API Reference
├── Migrations
├── Addons
└── Contributing
```

The homepage should route readers to these documents rather than duplicating their full contents.

## Blog / announcements

Keep the existing restrained editorial style. Make date and category visible enough to support scanning without turning posts into giant cards.

## Reading surface

Long-form pages should have a controlled reading measure, clear heading hierarchy, readable code blocks, tables that handle narrow screens, and links that remain obvious without relying on color alone.

## Link verification

Build a generated-site link check that validates internal links against the actual emitted `/home/` paths. Do this after generation so template correctness and deployed-path correctness are both tested.

## Acceptance checklist

- [ ] Home/docs/blog use one navigation model.
- [ ] Active location is obvious.
- [ ] Docs are organized by task/reference intent.
- [ ] Code and tables remain usable on mobile.
- [ ] Reading width is controlled.
- [ ] Internal links are checked against the GitHub Pages base path.
- [ ] Blog metadata is visible without clutter.
- [ ] Footer complements rather than duplicates navigation.
