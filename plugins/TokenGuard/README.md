# TokenGuard — by Cordinsanity

> Überwacht alle Netzwerk-Anfragen und warnt wenn ein Plugin deinen Discord-Token weitersendet

```
https://cordinsanity.github.io/revenge-plugins/TokenGuard/index.js
```

---

## Was macht das Plugin?

Revenge/Vendetta-Plugins haben vollen Zugriff auf `fetch` — das bedeutet jedes installierte Plugin kann theoretisch deinen Discord-Token an eine externe URL schicken, ohne dass du es merkst.

TokenGuard patcht `globalThis.fetch` und prüft **jede einzelne Netzwerk-Anfrage** die aus Discord heraus gemacht wird. Wenn dabei dein Token (`Authorization`-Header) an eine Domain gesendet wird die nicht zu Discord gehört, bekommst du sofort eine Warnung.

---

## Features

### Echtzeit-Monitoring
- Überwacht **alle** `fetch`-Anfragen im Hintergrund
- Prüft ob der `Authorization`-Header (= dein Token) mitgeschickt wird
- Unterscheidet zwischen Discord-eigenen Anfragen (OK) und fremden URLs (🚨 Verdächtig)
- **Toast-Benachrichtigung** bei verdächtigen Anfragen

### Request-Log
- Vollständiger Log aller Anfragen mit Token in den Settings
- 🔴 Rot = verdächtig (fremde Domain), 🟢 Grün = ok (Discord)
- Zeigt: Domain, Methode, URL-Vorschau, Uhrzeit
- Bis zu 200 Einträge, älteste werden automatisch gelöscht
- Log lässt sich per Knopfdruck löschen

### Schutz-Optionen
- **Anfragen automatisch blockieren** — verdächtige Anfragen werden blockiert bevor sie rausgehen
- **Nur verdächtige loggen** — spart Speicher, Discord-Anfragen werden ignoriert

### Whitelist
- Standard-Whitelist: alle Discord-Domains
- Eigene Domains hinzufügbar (z.B. für selbstgehostete Bots)
- Domains aus der Whitelist werden nie als verdächtig markiert

### Status-Banner
- Zeigt auf einen Blick: wie viele verdächtige Anfragen erkannt wurden
- 🛡️ Grün = alles ok / 🚨 Rot = Aktion empfohlen

---

## Warum ist das wichtig?

Ein bösartiges oder kompromittiertes Plugin könnte:
- Deinen Token an einen fremden Server schicken
- Deine Account-Daten stehlen
- Im Hintergrund Anfragen machen ohne dein Wissen

TokenGuard macht das sichtbar — und kann es optional auch blockieren.

---

**Autor:** Cordinsanity — [github.com/cordinsanity](https://github.com/cordinsanity)
