import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import EmojiStatsSettings from "./Settings.js";

// Defaults
if (!storage.settings) storage.settings = {};
if (storage.settings.enabled === undefined) storage.settings.enabled = true;
if (!storage.stats) storage.stats = { totalMessages: 0, byGuild: {}, byHour: Array(24).fill(0), emojiCounts: {} };

const FluxDispatcher = findByProps("dispatch", "subscribe");
const UserStore = findByStoreName("UserStore");
const GuildStore = findByStoreName("GuildStore");
const ChannelStore = findByStoreName("ChannelStore");

// Only custom (server) emoji are reliably detectable via the Discord markup
// shorthand — unicode emoji would need a full emoji-range table, which isn't
// worth bundling just for a stats counter.
const CUSTOM_EMOJI_RE = /<a?:(\w+):\d+>/g;

function recordMessage(message) {
  const stats = storage.stats;
  stats.totalMessages = (stats.totalMessages || 0) + 1;

  const hour = new Date(message.timestamp || Date.now()).getHours();
  stats.byHour = stats.byHour || Array(24).fill(0);
  stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

  try {
    const channel = ChannelStore?.getChannel?.(message.channel_id);
    const guildId = channel?.guild_id;
    const key = guildId ? (GuildStore?.getGuild?.(guildId)?.name || guildId) : "Direct Messages";
    stats.byGuild = stats.byGuild || {};
    stats.byGuild[key] = (stats.byGuild[key] || 0) + 1;
  } catch {}

  const content = message.content || "";
  let match;
  CUSTOM_EMOJI_RE.lastIndex = 0;
  while ((match = CUSTOM_EMOJI_RE.exec(content))) {
    const name = `:${match[1]}:`;
    stats.emojiCounts = stats.emojiCounts || {};
    stats.emojiCounts[name] = (stats.emojiCounts[name] || 0) + 1;
  }

  storage.stats = stats;
}

let unpatch = null;

export const settings = (props) => React.createElement(EmojiStatsSettings, { ...props, storage });

export function onLoad() {
  if (!FluxDispatcher || !UserStore) {
    console.error("[EmojiStats] FluxDispatcher or UserStore not found");
    return;
  }

  unpatch = before("dispatch", FluxDispatcher, ([action]) => {
    if (action?.type !== "MESSAGE_CREATE" || !storage.settings.enabled) return;

    try {
      const message = action.message;
      const me = UserStore.getCurrentUser?.();
      if (!message || !me || message.author?.id !== me.id) return;
      recordMessage(message);
    } catch (e) {
      console.error("[EmojiStats] dispatch handler error:", e);
    }
  });
}

export function onUnload() {
  try { unpatch?.(); } catch {}
}
