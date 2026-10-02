#!/usr/bin/env bash
#==============================================================================
# Airlink installer bootstrap
# Downloads the prebuilt airlink-installer binary for this platform from the
# rolling `latest-build` release and runs it (as root for real actions).
# The binary is a self-contained OpenTUI installer built by CI with
# `bun build --compile` - no git, no bun, no source checkout is needed.
#
# Usage:
#   bash <(curl -fsSL https://airlinklabs.xyz/install)  # fresh machine
#   curl -fsSL https://airlinklabs.xyz/install | bash   # fresh machine (piped)
#   curl -fsSL https://airlinklabs.xyz/install | bash -s -- --install-both
#   curl -fsSL https://airlinklabs.xyz/install | bash -s -- --install-both --yes
#                                     # scripted: plain logs, no TTY, exit code = result
#   ./installer.sh --help        # usage; no TTY, no root needed
#   ./installer.sh --no-color    # plain logs explicitly (pipes / CI); actions still need root
#   ./installer.sh --demo        # UI preview; no root, no system changes
#   no TTY at all -> the binary falls back to plain logs on its own; scripts
#   never have to pass --no-color (uninstalls still need --yes).
#
# Env:
#   AIRLINK_INSTALLER_DL    download base URL (default: the latest-build release)
#==============================================================================
set -euo pipefail

DOWNLOAD_BASE="${AIRLINK_INSTALLER_DL:-https://github.com/airlinklabs/installer/releases/download/latest-build}"
SELF_NAME="airlink-installer"

say()  { printf '\033[1;36m::\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

plain=0 want_help=0 want_demo=0 want_action=0
for a in "$@"; do
    case "$a" in
        --no-color)                 plain=1 ;;
        --help|-h)                  want_help=1 ;;
        --demo)                     want_demo=1 ;;
        --install-*|--uninstall-*)  want_action=1 ;;
    esac
done

# --- 1. platform -> asset name ----------------------------------------------
# linux-x64 / linux-arm64 on glibc; musl (Alpine) is refused above.
detect_platform() {
    [ "$(uname -s)" = "Linux" ] || die "unsupported OS: $(uname -s) - this installer targets Linux (x64/arm64, glibc)"
    case "$(uname -m)" in
        x86_64|amd64)  arch=x64 ;;
        aarch64|arm64) arch=arm64 ;;
        *) die "unsupported architecture: $(uname -m) - supported: x86_64, aarch64" ;;
    esac
    if ldd --version 2>&1 | grep -qi musl; then
        die "musl/Alpine systems are not supported - this installer manages services with systemd (Debian/Ubuntu, RHEL/Fedora, Arch, openSUSE)"
    fi
    ASSET="${SELF_NAME}-linux-${arch}"
}

# --- 2. TTY guard ------------------------------------------------------------
# The TUI needs a terminal; --help and plain logs never do, and must work in
# pipes and CI. When this script is read from stdin (curl | bash), fd0 stays on
# the pipe - the TUI gets /dev/tty instead, so bash can finish reading the
# script from the pipe. With no TTY anywhere the binary is still run: it falls
# back to plain logs itself (scripts never have to pass --no-color).
tty_in=""
if [ "$want_help" -eq 0 ] && [ "$plain" -eq 0 ]; then
    if [ -t 0 ] && [ -t 1 ]; then
        :
    elif { : < /dev/tty; } 2>/dev/null && [ -t 1 ]; then
        tty_in="</dev/tty"
    else
        warn "no TTY - falling back to plain logs"
    fi
elif [ "$plain" -eq 1 ]; then
    warn "plain mode (--no-color): logs go straight to stdout"
fi

# --- 3. root -----------------------------------------------------------------
# --help, --demo and plain-without-an-action never touch the system, so they
# run as the invoking user. Everything else runs the binary as root: it is root,
# so no sudo keepalive is needed downstream (the TS side execs directly).
need_root=1
if [ "$want_help" -eq 1 ] || [ "$want_demo" -eq 1 ]; then
    need_root=0
fi
if [ "$plain" -eq 1 ] && [ "$want_action" -eq 0 ]; then
    need_root=0
fi

SUDO=()
if [ "$need_root" -eq 1 ] && [ "$(id -u)" -ne 0 ]; then
    command -v sudo >/dev/null 2>&1 \
        || die "root or sudo is required to install - run as root, or use --help / --demo"
    if { : < /dev/tty; } 2>/dev/null; then
        say "sudo password needed once (the installer runs as root)"
        sudo -v || die "sudo is required to run the installer"
    else
        # non-interactive: no pty to prompt on - passwordless sudo only
        sudo -n true 2>/dev/null \
            || die "no TTY to prompt on - root or passwordless sudo required for this action"
    fi
    SUDO=(sudo)
fi

# --- 4. download the binary for this platform --------------------------------
detect_platform
URL="${DOWNLOAD_BASE}/${ASSET}"

WORKDIR="$(mktemp -d /tmp/airlink-installer.XXXXXX)"
trap 'rm -rf "$WORKDIR"' EXIT
BIN="${WORKDIR}/${SELF_NAME}"

say "fetching ${ASSET}"
if command -v curl >/dev/null 2>&1; then
    curl -fL --retry 3 --connect-timeout 10 -o "$BIN" "$URL" || die "download failed: $URL
(no binary for this platform, or the release is missing - check github.com/airlinklabs/installer/actions)"
elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$BIN" "$URL" || die "download failed: $URL"
else
    die "curl or wget is required to download the installer"
fi
chmod +x "$BIN"

# checksum when CI published one; absence of tool or sidecar is never fatal
if curl -fsSL --retry 2 -o "${BIN}.sha256" "${URL}.sha256" 2>/dev/null \
        && command -v sha256sum >/dev/null 2>&1; then
    want="$(cut -d' ' -f1 "${BIN}.sha256")"
    have="$(sha256sum "$BIN" | cut -d' ' -f1)"
    [ "$want" = "$have" ] || die "checksum mismatch for ${ASSET} (corrupted download) - re-run this script"
    say "checksum ok"
fi

# --- 5. run it ---------------------------------------------------------------
say "starting airlink installer"
set +e
if [ -n "$tty_in" ]; then
    # stdin is still the pipe carrying this script; give the TUI the real
    # terminal instead so bash can finish reading the script.
    ${SUDO[@]+"${SUDO[@]}"} "$BIN" "$@" </dev/tty
else
    ${SUDO[@]+"${SUDO[@]}"} "$BIN" "$@"
fi
rc=$?
set -e
exit "$rc"
