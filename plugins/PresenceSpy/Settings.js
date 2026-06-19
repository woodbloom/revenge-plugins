import { React, ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { showToast } from "@vendetta/ui/toasts";
import { showConfirmationAlert } from "@vendetta/ui/alerts";

const { View, Text, ScrollView, TouchableOpacity, TextInput } = ReactNative;

const SECTION = {
  color: "#7289DA", fontSize: 11, fontWeight: "700",
  letterSpacing: 1.2, paddingHorizontal: 16,
  paddingTop: 20, paddingBottom: 6, textTransform: "uppercase",
};
const CARD = {
  backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12,
  marginHorizontal: 12, marginBottom: 8, overflow: "hidden",
};
const STATUS_COLORS = { online: "#43B581", idle: "#FAA61A", dnd: "#F04747", offline: "#747F8D" };

function TrackedRow({ id, info, userTag, onRemove }) {
  const color = STATUS_COLORS[info.lastStatus] || "#747F8D";
  return React.createElement(View, { style: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.07)" } },
    React.createElement(View, { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 10 } }),
    React.createElement(View, { style: { flex: 1 } },
      React.createElement(Text, { style: { color: "#fff", fontSize: 14, fontWeight: "600" } }, info.label || userTag(id)),
      React.createElement(Text, { style: { color: "#72767d", fontSize: 11, marginTop: 1 } }, `${id} — ${info.lastStatus || "unknown"}`)
    ),
    React.createElement(TouchableOpacity, { onPress: onRemove },
      React.createElement(Text, { style: { color: "#F04747", fontSize: 13, fontWeight: "600" } }, "Remove")
    )
  );
}

function LogRow({ entry }) {
  const color = STATUS_COLORS[entry.status] || "#747F8D";
  return React.createElement(View, { style: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.07)" } },
    React.createElement(Text, { style: { color: "#fff", fontSize: 14 } }, `${entry.userTag} → `, React.createElement(Text, { style: { color, fontWeight: "700" } }, entry.status)),
    React.createElement(Text, { style: { color: "#72767d", fontSize: 11, marginTop: 2 } }, new Date(entry.time).toLocaleString())
  );
}

export default function PresenceSpySettings({ storage, userTag }) {
  const s = useProxy(storage);
  const [newId, setNewId] = React.useState("");
  const [newLabel, setNewLabel] = React.useState("");
  const tracked = s.tracked || {};
  const log = s.log || [];

  const addTracked = () => {
    const id = newId.trim();
    if (!/^\d{15,22}$/.test(id)) { showToast("Enter a valid user ID", 1); return; }
    s.tracked = { ...tracked, [id]: { label: newLabel.trim() || null, lastStatus: null } };
    setNewId(""); setNewLabel("");
    showToast("User added to tracking list", 0);
  };

  return React.createElement(ScrollView, { style: { flex: 1 } },

    React.createElement(Text, { style: SECTION }, "Track a user"),
    React.createElement(View, { style: CARD },
      React.createElement(View, { style: { padding: 16 } },
        React.createElement(TextInput, {
          placeholder: "User ID", placeholderTextColor: "#72767d", value: newId, onChangeText: setNewId,
          style: { backgroundColor: "#40444b", color: "white", padding: 10, borderRadius: 8, marginBottom: 8, fontSize: 14 },
        }),
        React.createElement(TextInput, {
          placeholder: "Label (optional)", placeholderTextColor: "#72767d", value: newLabel, onChangeText: setNewLabel,
          style: { backgroundColor: "#40444b", color: "white", padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 14 },
        }),
        React.createElement(TouchableOpacity, {
          onPress: addTracked,
          style: { backgroundColor: "#43B581", padding: 12, borderRadius: 8, alignItems: "center" },
        }, React.createElement(Text, { style: { color: "#fff", fontWeight: "700" } }, "Add"))
      )
    ),

    React.createElement(Text, { style: SECTION }, `Tracked (${Object.keys(tracked).length})`),
    React.createElement(View, { style: CARD },
      Object.keys(tracked).length === 0
        ? React.createElement(Text, { style: { color: "#72767d", fontSize: 13, padding: 16 } }, "No users tracked yet.")
        : Object.entries(tracked).map(([id, info]) => React.createElement(TrackedRow, {
            key: id, id, info, userTag,
            onRemove: () => { const t = { ...s.tracked }; delete t[id]; s.tracked = t; },
          }))
    ),

    React.createElement(Text, { style: SECTION }, `History (${log.length})`),
    React.createElement(View, { style: CARD },
      log.length === 0
        ? React.createElement(Text, { style: { color: "#72767d", fontSize: 13, padding: 16 } }, "No status changes logged yet.")
        : log.slice(0, 100).map(entry => React.createElement(LogRow, { key: entry.id, entry }))
    ),

    log.length > 0 && React.createElement(View, { style: CARD },
      React.createElement(TouchableOpacity, {
        onPress: () => showConfirmationAlert({
          title: "Clear History", content: "Permanently delete the local status-change history.",
          confirmText: "Clear", cancelText: "Cancel", confirmColor: "brand",
          onConfirm: () => { s.log = []; showToast("History cleared", 0); },
        }),
        style: { paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" }
      }, React.createElement(Text, { style: { color: "#F04747", fontSize: 15, fontWeight: "600" } }, "Clear History"))
    ),

    React.createElement(View, { style: { height: 40 } })
  );
}
