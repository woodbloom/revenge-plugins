import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { showToast } from "@vendetta/ui/toasts";
import PresenceSpySettings from "./Settings.js";

// Defaults
if (!storage.settings) storage.settings = {};
if (!storage.tracked) storage.tracked = {};
if (!storage.log) storage.log = [];
if (storage.settings.maxEntries === undefined) storage.settings.maxEntries = 300;

const FluxDispatcher = findByProps("dispatch", "subscribe");
const UserStore = findByStoreName("UserStore");

function addLog(entry) {
  const log = storage.log || [];
  log.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, time: Date.now(), ...entry });
  const max = storage.settings.maxEntries || 300;
  if (log.length > max) log.length = max;
  storage.log = log;
}

function userTag(id) {
  try { return UserStore?.getUser?.(id)?.username || id; } catch { return id; }
}

function handlePresence(userId, status) {
  if (!userId || !storage.tracked[userId]) return;
  const last = storage.tracked[userId].lastStatus;
  if (status === last) return;
  storage.tracked[userId] = { ...storage.tracked[userId], lastStatus: status };
  addLog({ userId, userTag: userTag(userId), status });
  showToast(`${storage.tracked[userId].label || userTag(userId)} is now ${status}`, 0);
}

let unpatch = null;

export const settings = (props) => React.createElement(PresenceSpySettings, { ...props, storage, userTag });

export function onLoad() {
  if (!FluxDispatcher) {
    console.error("[PresenceSpy] FluxDispatcher not found");
    return;
  }

  // Discord's gateway batches presence changes; depending on client/gateway
  // version the dispatcher sees either a single PRESENCE_UPDATE per change or
  // a batched PRESENCE_UPDATES with an `updates` array — handle both so this
  // doesn't silently stop working if the client switches format.
  unpatch = before("dispatch", FluxDispatcher, ([action]) => {
    if (!action?.type) return;

    try {
      if (action.type === "PRESENCE_UPDATE" && action.presence) {
        handlePresence(action.presence.user?.id, action.presence.status);
      } else if (action.type === "PRESENCE_UPDATES" && Array.isArray(action.updates)) {
        for (const u of action.updates) {
          handlePresence(u.user?.id, u.status);
        }
      }
    } catch (e) {
      console.error("[PresenceSpy] dispatch handler error:", e);
    }
  });
}

export function onUnload() {
  try { unpatch?.(); } catch {}
}
