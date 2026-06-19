import { React, ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { showToast } from "@vendetta/ui/toasts";
import { showConfirmationAlert } from "@vendetta/ui/alerts";

const { View, Text, Switch, ScrollView, TouchableOpacity } = ReactNative;

const ROW = {
  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  paddingVertical: 14, paddingHorizontal: 16,
  borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.07)",
};
const SECTION = {
  color: "#7289DA", fontSize: 11, fontWeight: "700",
  letterSpacing: 1.2, paddingHorizontal: 16,
  paddingTop: 20, paddingBottom: 6, textTransform: "uppercase",
};
const CARD = {
  backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12,
  marginHorizontal: 12, marginBottom: 8, overflow: "hidden",
};

function ToggleRow({ label, sub, value, onToggle }) {
  return React.createElement(View, { style: ROW },
    React.createElement(View, { style: { flex: 1, paddingRight: 12 } },
      React.createElement(Text, { style: { color: "#fff", fontSize: 16, fontWeight: "600" } }, label),
      sub && React.createElement(Text, { style: { color: "#aaa", fontSize: 12, marginTop: 2 } }, sub)
    ),
    React.createElement(Switch, {
      value: !!value,
      onValueChange: onToggle,
      trackColor: { true: "#7289DA", false: "#555" },
    })
  );
}

function BarRow({ label, count, max }) {
  const pct = max ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return React.createElement(View, { style: { paddingVertical: 8, paddingHorizontal: 16 } },
    React.createElement(View, { style: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 } },
      React.createElement(Text, { style: { color: "#fff", fontSize: 13 } }, label),
      React.createElement(Text, { style: { color: "#aaa", fontSize: 12 } }, String(count))
    ),
    React.createElement(View, { style: { height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)" } },
      React.createElement(View, { style: { height: 6, borderRadius: 3, width: `${pct}%`, backgroundColor: "#7289DA" } })
    )
  );
}

function topEntries(obj, n) {
  return Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default function EmojiStatsSettings({ storage }) {
  const s = useProxy(storage);
  const stats = s.stats || {};
  const topGuilds = topEntries(stats.byGuild, 8);
  const topEmoji = topEntries(stats.emojiCounts, 10);
  const maxGuild = topGuilds[0]?.[1] || 1;
  const maxEmoji = topEmoji[0]?.[1] || 1;
  const busiestHour = (stats.byHour || []).reduce((best, v, h) => v > (stats.byHour[best] || 0) ? h : best, 0);

  return React.createElement(ScrollView, { style: { flex: 1 } },

    React.createElement(Text, { style: SECTION }, "Status"),
    React.createElement(View, { style: CARD },
      React.createElement(ToggleRow, {
        label: "Track my message stats",
        sub: "Counts only your own messages, stored locally",
        value: s.settings.enabled,
        onToggle: v => { s.settings.enabled = v; },
      }),
      React.createElement(View, { style: { paddingVertical: 14, paddingHorizontal: 16 } },
        React.createElement(Text, { style: { color: "#43B581", fontSize: 22, fontWeight: "700" } }, `${stats.totalMessages || 0} messages`),
        React.createElement(Text, { style: { color: "#aaa", fontSize: 12, marginTop: 2 } }, `Busiest hour: ${busiestHour}:00–${busiestHour + 1}:00`)
      )
    ),

    React.createElement(Text, { style: SECTION }, "Top servers/DMs"),
    React.createElement(View, { style: CARD },
      topGuilds.length === 0
        ? React.createElement(Text, { style: { color: "#72767d", fontSize: 13, padding: 16 } }, "No messages tracked yet.")
        : topGuilds.map(([name, count]) => React.createElement(BarRow, { key: name, label: name, count, max: maxGuild }))
    ),

    React.createElement(Text, { style: SECTION }, "Most-used custom emoji"),
    React.createElement(View, { style: CARD },
      topEmoji.length === 0
        ? React.createElement(Text, { style: { color: "#72767d", fontSize: 13, padding: 16 } }, "No custom emoji tracked yet.")
        : topEmoji.map(([name, count]) => React.createElement(BarRow, { key: name, label: name, count, max: maxEmoji }))
    ),

    React.createElement(View, { style: CARD },
      React.createElement(TouchableOpacity, {
        onPress: () => showConfirmationAlert({
          title: "Reset Stats", content: "Permanently delete all tracked stats.",
          confirmText: "Reset", cancelText: "Cancel", confirmColor: "brand",
          onConfirm: () => { s.stats = { totalMessages: 0, byGuild: {}, byHour: Array(24).fill(0), emojiCounts: {} }; showToast("Stats reset", 0); },
        }),
        style: { paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" }
      }, React.createElement(Text, { style: { color: "#F04747", fontSize: 15, fontWeight: "600" } }, "Reset Stats"))
    ),

    React.createElement(View, { style: { height: 40 } })
  );
}
