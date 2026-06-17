# GhostMode — by Cordinsanity

> Unsichtbar schalten, Tipp-Indikator und Lesebestätigungen blockieren — direkt aus dem You Bar

```
https://cordinsanity.github.io/revenge-plugins/GhostMode/index.js
```

---

## Was macht das Plugin?

GhostMode gibt dir einen **👻 Ghost-Button direkt im You Bar** (neben der Glocke unten), mit dem du dich auf Knopfdruck unsichtbar schalten kannst. Andere sehen dich dann als offline, obwohl du aktiv bist.

Zusätzlich blockiert GhostMode optional den Tipp-Indikator und Lesebestätigungen — niemand sieht mehr dass du online bist oder gerade tippst.

---

## Features

### Ghost-Toggle im You Bar
- 👻 / 👤 Button direkt neben der Glocke im You Bar
- Ein Druck → Status sofort auf **Invisible**
- Nochmal drücken → zurück zu deinem normalen Status
- Langer Druck → zeigt aktuellen Ghost-Status als Toast

### Privacy-Funktionen
- **Tipp-Indikator blockieren** — niemand sieht "tippt..." wenn du im Ghost-Modus bist
- **Lesebestätigungen blockieren** — Kanäle werden nicht automatisch als gelesen markiert
- Status bleibt **Invisible** auch wenn du aktiv navigierst

### Einstellungen
- **Standard-Status nach Ghost-Off** — wähle ob du zu Online / Idle / DND / Invisible zurückkehrst
- **You Bar Button** — kann deaktiviert werden falls du ihn nicht willst
- Tipp-Blocker und Read-Receipt-Blocker einzeln ein-/ausschaltbar

---

## Wie es funktioniert

GhostMode patcht intern `PresenceActions.updateStatus` um den Status auf `invisible` zu setzen, und blockiert `startTyping` sowie `ack` (Mark-as-Read) Calls wenn Ghost aktiv ist. Beim Entladen des Plugins wird der Status automatisch wiederhergestellt.

---

**Autor:** Cordinsanity — [github.com/cordinsanity](https://github.com/cordinsanity)
