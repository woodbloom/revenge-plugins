# Plugin Loader — by woodbloom

Plugin Loader is a hub for every other woodbloom plugin — install, update or enable/disable all of them from one screen, instead of copy-pasting install links one by one.

```
https://woodbloom.github.io/revenge-plugins/PluginLoader/
```

---

## Features

### One screen for everything
- Lists every woodbloom plugin (MoreAlts, GhostMode, TokenGuard, Proxifier, MessageVault) with name, description and live install status
- **⬇️ Install All** installs every plugin you don't have yet, in one tap
- **🔄 Update Installed** re-fetches the latest build for every plugin already installed — useful right after a new release

### Per-plugin controls
- Not installed → **⬇️ Install** button installs and enables it immediately
- Installed → a switch lets you enable/disable it without leaving this screen
- **↻ Reinstall / Update** re-downloads just that one plugin

### Sidebar shortcut
- Adds a **Plugin Loader** button to your Discord settings sidebar, right alongside MoreAlts' **Account Switcher** and MessageVault's **Message Logger** buttons
- Can be disabled via the "Add to Settings Sidebar" toggle (restart the app to apply)

---

## Notes

- Uses Revenge/Vendetta's built-in plugin manager (`@vendetta/plugins`) — installing/enabling/disabling here is identical to doing it through the normal Plugins screen, just batched.
- Plugin Loader doesn't list itself, since it's already running by definition.
- If an install fails (bad network, plugin temporarily unreachable), a toast explains the failure instead of silently doing nothing.

---

**Author:** woodbloom — [github.com/woodbloom](https://github.com/woodbloom)
