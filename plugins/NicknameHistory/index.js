import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import NicknameHistorySettings from "./Settings.js";

// Defaults
if (!storage.settings) storage.settings = {};
if (!storage.log) storage.log = [];
if (!storage.snapshots) storage.snapshots = {}; // userId -> { username, nicks: { guildId: nick } }
if (storage.settings.trackNicknames === undefined) storage.settings.trackNicknames = true;
if (storage.settings.trackUsernames === undefined) storage.settings.trackUsernames = true;
if (storage.settings.maxEntries === undefined) storage.settings.maxEntries = 500;

const FluxDispatcher = findByProps("dispatch", "subscribe");
const GuildStore = findByStoreName("GuildStore");

function addLog(entry) {
  const log = storage.log || [];
  log.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, time: Date.now(), ...entry });
  const max = storage.settings.maxEntries || 500;
  if (log.length > max) log.length = max;
  storage.log = log;
}

function getSnapshot(userId) {
  if (!storage.snapshots[userId]) storage.snapshots[userId] = { username: null, nicks: {} };
  return storage.snapshots[userId];
}

let unpatch = null;

export const settings = (props) => React.createElement(NicknameHistorySettings, { ...props, storage });

export function onLoad() {
  if (!FluxDispatcher) {
    console.error("[NicknameHistory] FluxDispatcher not found");
    return;
  }

  unpatch = before("dispatch", FluxDispatcher, ([action]) => {
    if (!action?.type) return;

    try {
      if (action.type === "GUILD_MEMBER_UPDATE" && storage.settings.trackNicknames) {
        const userId = action.user?.id;
        if (!userId) return;
        const snap = getSnapshot(userId);
        const prevNick = snap.nicks[action.guildId];
        const newNick = action.nick || null;
        if (prevNick !== undefined && prevNick !== newNick) {
          const guildName = (() => { try { return GuildStore?.getGuild?.(action.guildId)?.name; } catch { return null; } })();
          addLog({
            kind: "nick", userId,
            userTag: action.user?.username || userId,
            guildId: action.guildId, guildName,
            before: prevNick, after: newNick,
          });
        }
        snap.nicks[action.guildId] = newNick;
      } else if (action.type === "USER_UPDATE" && storage.settings.trackUsernames) {
        const user = action.user;
        if (!user?.id) return;
        const snap = getSnapshot(user.id);
        if (snap.username !== null && snap.username !== user.username) {
          addLog({ kind: "username", userId: user.id, before: snap.username, after: user.username });
        }
        snap.username = user.username;
      }
    } catch (e) {
      console.error("[NicknameHistory] dispatch handler error:", e);
    }
  });
}

export function onUnload() {
  try { unpatch?.(); } catch {}
}
