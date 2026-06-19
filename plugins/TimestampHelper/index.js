import { registerCommand } from "@vendetta/commands";
import { clipboard } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import { React } from "@vendetta/metro/common";
import TimestampHelperSettings from "./Settings.js";

const authorMods = {
  author: { username: "TimestampHelper by woodbloom", avatar: "command" },
};

function sendMessage() {
  if (window.sendMessage) return window.sendMessage?.(...arguments);
}

const UNIT_MS = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };

function parseWhen(input) {
  const trimmed = (input || "").trim().toLowerCase();
  if (!trimmed || trimmed === "now") return Date.now();

  const relRe = /(\d+)\s*(w|d|h|m|s)/g;
  let matched = false, totalMs = 0, m;
  while ((m = relRe.exec(trimmed))) {
    matched = true;
    totalMs += Number(m[1]) * UNIT_MS[m[2]];
  }
  if (matched) return Date.now() + totalMs;

  const parsed = Date.parse(input);
  if (!Number.isNaN(parsed)) return parsed;

  return null;
}

const VALID_STYLES = ["t", "T", "d", "D", "f", "F", "R"];

export const settings = (props) => React.createElement(TimestampHelperSettings, props);

export function onLoad() {
  const command = {
    type: 1,
    inputType: 1,
    applicationId: "-1",
    name: "timestamp",
    description: "Generate a Discord timestamp from a relative time (e.g. 2h, 3d) or date",
    options: [
      { required: true, type: 3, name: "when", description: "e.g. '2h', '3d12h', 'now', or a date like 2026-12-31" },
      { required: false, type: 3, name: "style", description: "t/T/d/D/f/F/R (default R = relative, e.g. 'in 2 hours')" },
    ],
    execute: async (args, ctx) => {
      try {
        const options = new Map(args.map(a => [a.name, a]));
        const when = options.get("when")?.value;
        const styleInput = (options.get("style")?.value || "R").trim();
        const style = VALID_STYLES.includes(styleInput) ? styleInput : "R";

        const ms = parseWhen(when);
        if (ms === null) {
          sendMessage?.({
            loggingName: "TimestampHelper error",
            channelId: ctx.channel.id,
            embeds: [{ type: "rich", title: "❌ Couldn't parse that", description: "Try something like `2h`, `3d12h`, `now`, or `2026-12-31`." }],
          }, authorMods);
          showToast("Couldn't parse that time", 1);
          return;
        }

        const unix = Math.floor(ms / 1000);
        const markup = `<t:${unix}:${style}>`;
        clipboard.setString(markup);

        sendMessage?.({
          loggingName: "TimestampHelper result",
          channelId: ctx.channel.id,
          embeds: [{ type: "rich", title: "🕐 Timestamp generated", description: `\`${markup}\`\n\nCopied to clipboard — paste it into your message.` }],
        }, authorMods);
        showToast("Timestamp copied to clipboard", 0);
      } catch (e) {
        console.error("[TimestampHelper] command failed:", e);
        showToast("Failed to generate timestamp", 1);
      }
    },
  };

  try { registerCommand(command); }
  catch (e) { console.error("[TimestampHelper] Failed to register command:", e); }
}

export function onUnload() {}
