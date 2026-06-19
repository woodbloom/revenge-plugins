import { React, ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { showToast } from "@vendetta/ui/toasts";
import { showConfirmationAlert } from "@vendetta/ui/alerts";

const { View, Text, Switch, ScrollView, TouchableOpacity, TextInput } = ReactNative;

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

function LogRow({ entry }) {
  const isNick = entry.kind === "nick";
  const label = isNick
    ? `${entry.userTag}${entry.guildName ? ` in ${entry.guildName}` : ""}: ${entry.before || "(no nickname)"} → ${entry.after || "(no nickname)"}`
    : `${entry.userId}: @${entry.before} → @${entry.after}`;
  return React.createElement(View, { style: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.07)" } },
    React.createElement(Text, { style: { color: "#fff", fontSize: 13 } }, `${isNick ? "✏️" : "🆔"} ${label}`),
    React.createElement(Text, { style: { color: "#72767d", fontSize: 11, marginTop: 2 } }, new Date(entry.time).toLocaleString())
  );
}

export default function NicknameHistorySettings({ storage }) {
  const s = useProxy(storage);
  const [filter, setFilter] = React.useState("");
  const log = s.log || [];
  const filtered = filter.trim()
    ? log.filter(e => e.userId.includes(filter.trim()) || e.userTag?.toLowerCase().includes(filter.trim().toLowerCase()))
    : log;

  return React.createElement(ScrollView, { style: { flex: 1 } },

    React.createElement(Text, { style: SECTION }, "Tracking"),
    React.createElement(View, { style: CARD },
      React.createElement(ToggleRow, {
        label: "Track nickname changes",
        sub: "Per-server nickname changes for anyone you share a server with",
        value: s.settings.trackNicknames,
        onToggle: v => { s.settings.trackNicknames = v; },
      }),
      React.createElement(ToggleRow, {
        label: "Track username changes",
        sub: "Global @username changes",
        value: s.settings.trackUsernames,
        onToggle: v => { s.settings.trackUsernames = v; },
      }),
    ),

    React.createElement(Text, { style: SECTION }, "Filter"),
    React.createElement(View, { style: CARD },
      React.createElement(TextInput, {
        placeholder: "Filter by user ID or name...", placeholderTextColor: "#72767d",
        value: filter, onChangeText: setFilter,
        style: { color: "white", padding: 14, fontSize: 14 },
      })
    ),

    React.createElement(Text, { style: SECTION }, `History (${filtered.length})`),
    React.createElement(View, { style: CARD },
      filtered.length === 0
        ? React.createElement(Text, { style: { color: "#72767d", fontSize: 13, padding: 16 } }, "Nothing logged yet.")
        : filtered.slice(0, 150).map(entry => React.createElement(LogRow, { key: entry.id, entry }))
    ),

    log.length > 0 && React.createElement(View, { style: CARD },
      React.createElement(TouchableOpacity, {
        onPress: () => showConfirmationAlert({
          title: "Clear History", content: "Permanently delete the local nickname/username history.",
          confirmText: "Clear", cancelText: "Cancel", confirmColor: "brand",
          onConfirm: () => { s.log = []; showToast("History cleared", 0); },
        }),
        style: { paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" }
      }, React.createElement(Text, { style: { color: "#F04747", fontSize: 15, fontWeight: "600" } }, "Clear History"))
    ),

    React.createElement(View, { style: { height: 40 } })
  );
}
