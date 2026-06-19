import { React, ReactNative } from "@vendetta/metro/common";

const { View, Text, ScrollView } = ReactNative;

const SECTION = {
  color: "#7289DA", fontSize: 11, fontWeight: "700",
  letterSpacing: 1.2, paddingHorizontal: 16,
  paddingTop: 20, paddingBottom: 6, textTransform: "uppercase",
};
const CARD = {
  backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12,
  marginHorizontal: 12, marginBottom: 8, overflow: "hidden",
  paddingVertical: 14, paddingHorizontal: 16,
};

function Row({ title, desc }) {
  return React.createElement(View, { style: { marginBottom: 10 } },
    React.createElement(Text, { style: { color: "#fff", fontSize: 15, fontWeight: "600" } }, title),
    React.createElement(Text, { style: { color: "#aaa", fontSize: 12, marginTop: 2 } }, desc)
  );
}

export default function TimestampHelperSettings() {
  return React.createElement(ScrollView, { style: { flex: 1 } },

    React.createElement(Text, { style: SECTION }, "Usage"),
    React.createElement(View, { style: CARD },
      React.createElement(Row, { title: "/timestamp 2h", desc: "2 hours from now, shown relative (\"in 2 hours\")" }),
      React.createElement(Row, { title: "/timestamp 3d12h F", desc: "3 days 12 hours from now, full date & time style" }),
      React.createElement(Row, { title: "/timestamp 2026-12-31 D", desc: "An absolute date, shown as a long date" }),
    ),

    React.createElement(Text, { style: SECTION }, "Styles"),
    React.createElement(View, { style: CARD },
      React.createElement(Row, { title: "R (default)", desc: "Relative — \"in 2 hours\" / \"3 days ago\"" }),
      React.createElement(Row, { title: "t / T", desc: "Short / long time" }),
      React.createElement(Row, { title: "d / D", desc: "Short / long date" }),
      React.createElement(Row, { title: "f / F", desc: "Short / long date and time" }),
    ),

    React.createElement(Text, { style: SECTION }, "About"),
    React.createElement(View, { style: CARD },
      React.createElement(Text, { style: { color: "#aaa", fontSize: 13, lineHeight: 18 } },
        "No settings to configure. The generated markup is also copied to your clipboard so you can paste it anywhere."
      )
    ),

    React.createElement(View, { style: { height: 40 } })
  );
}
