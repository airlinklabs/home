# Example implementation: #8 — a clearer installation path

Reference for [#8](https://github.com/airlinklabs/home/issues/8).

## Target sequence

```text
Install AirLink
Recommended method
  -> Requirements
  -> Command
  -> What the command installs
  -> Verify
  -> Troubleshooting
  -> Full documentation
```

## Recommended path

Mark exactly one method as recommended. Keep the quick command concise and make it obvious where it runs.

```text
Recommended
bash <(curl -s https://raw.githubusercontent.com/airlinklabs/panel/refs/heads/main/installer.sh)
[Copy command]
```

The implementation must source the command from structured data rather than duplicating it across templates.

## Prerequisites

Show only verified prerequisites before the command. Separate hard requirements from optional/environment-specific dependencies. Version requirements belong in `data/site.json` or another single structured source.

## Explain Panel vs Daemon

Before manual installation, state what each component does and whether they normally live on the same machine. The page should not assume the reader already understands AirLink's architecture.

## Verification

End with a compact success path based on actual project behavior:

```text
1. Panel is running
2. Daemon is running
3. Database setup completed
4. Daemon connects to Panel
5. A server can be created/seen
```

The exact commands must be copied from authoritative project behavior/docs, not invented in the homepage template.

## Copy interaction

Copy buttons need accessible labels and deterministic feedback such as `Copied` followed by a reset to `Copy`. Code should remain selectable and readable without JavaScript.

## Acceptance checklist

- [ ] One recommended installation method is explicit.
- [ ] Prerequisites appear before commands.
- [ ] Panel/Daemon relationship is explained.
- [ ] Commands are copy-safe on mobile.
- [ ] Copy controls have accessible names and feedback.
- [ ] Verification is task-oriented.
- [ ] Version-sensitive data is centralized.
- [ ] Homepage stays concise while docs hold the complete procedure.
