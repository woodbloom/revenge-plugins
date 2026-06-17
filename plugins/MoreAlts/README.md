# MoreAlts — by Cordinsanity

> Sicherer Account-Switcher für Revenge/Vendetta Discord

```
https://cordinsanity.github.io/revenge-plugins/MoreAlts/index.js
```

---

## Was ist das?

MoreAlts erlaubt es mehrere Discord-Accounts zu speichern und per Knopfdruck zu wechseln. Das Original von Win8.1VMUser hat dabei alle Tokens im **Klartext** gespeichert und ein simples Bitshift als "Passwort-Hash" verwendet — jeder mit Zugriff auf dein Handy konnte alle Tokens direkt lesen.

Diese Version baut das komplett neu mit echter Kryptographie.

---

## Vergleich zum Original

| | Original MoreAlts | MoreAlts by Cordinsanity |
|---|---|---|
| Token-Speicherung | ❌ Klartext | ✅ AES-256-GCM verschlüsselt |
| Passwort-Hash | ❌ Bitshift (trivial) | ✅ PBKDF2 + SHA-256 + Salt |
| Verschlüsselung pro Account | ❌ Keine | ✅ HKDF-Ableitung pro Account |
| PIN-Lock | ❌ Nein | ✅ 4-stellig, PBKDF2-gehasht |
| Biometrie | ❌ Nein | ✅ Fingerabdruck / Face ID |
| Screenshot-Schutz | ❌ Nein | ✅ Ja (Android) |
| Memory Wipe | ❌ Nein | ✅ Token-Buffer wird nach Nutzung genullt |
| Login-Verlauf | ❌ Nein | ✅ Verschlüsselt, nur mit PIN |
| Nitro-Badge | ❌ Nein | ✅ Live auf jeder Account-Karte |
| Request Fingerprint | ❌ Nein | ✅ Zufällige User-Agent / Header |
| Unbekannte Geräte | ❌ Nein | ✅ Warnung bei neuen Sessions |

---

## Features

### Sicherheit
- **AES-256-GCM** — Tokens werden niemals im Klartext gespeichert
- **PBKDF2** Passwort-Hashing mit 100.000 Iterationen und zufälligem Salt
- **Per-Account-Salt** — jeder Token hat seinen eigenen HKDF-abgeleiteten Schlüssel
- **Memory Wipe** — entschlüsselter Token-Buffer wird nach Nutzung auf 0 gesetzt
- **PIN-Lock** — 4-stellige PIN zum Öffnen des Plugins
- **Panic Wipe** — löscht alle Accounts nach 5 falschen PIN-Versuchen
- **Biometrie** — Fingerabdruck / Face ID Unterstützung
- **Screenshot-Schutz** — verhindert Screenshots im Plugin (Android)
- **Unbekannte Geräte** — Warnung wenn ein neuer Login auf einem Account erkannt wird
- **Request Fingerprint Randomizer** — zufällige User-Agent und Header beim Login

### Account-Verwaltung
- Accounts per E-Mail + Passwort oder Token hinzufügen
- Aktuell eingeloggten Account mit einem Tap speichern
- Accounts sofort wechseln
- **Reihenfolge** der Accounts per ▲▼ ändern
- **Refresh-Button** pro Account — Nitro-Status, Avatar und Name live aktualisieren
- Accounts entfernen (nur aus Switcher, oder komplett ausloggen)
- Force-Logout ohne gespeicherte Accounts zu löschen

### UI
- **Nitro-Badge** auf jeder Account-Karte (`✦ Nitro` / `✦ Classic` / `✦ Basic`)
- Farbiger Rand pro Karte — blau = aktiv, lila = Nitro, grau = normal
- Avatar-Ring der Account-Typ widerspiegelt, gelb beim Wechsel
- Kompakte Action-Bar (Refresh / Token kopieren / Entfernen)

### Privacy & Info
- **Verschlüsselter Login-Verlauf** — jeder Wechsel, Hinzufügen und Entfernen wird protokolliert (PIN-geschützt)
- **Token Ablauf-Check** — prüft ob alle gespeicherten Tokens noch gültig sind
- **Clipboard Auto-Clear** — kopierte Tokens werden nach 30 Sekunden aus der Zwischenablage gelöscht
- **Export / Import** mit optionalem PBKDF2-Passwortschutz

### CLI-Befehle
```
/accswitcher         — Plugin-Übersicht
/accswitcher add     — Aktuellen Account speichern
/accswitcher login   — Zu einem gespeicherten Account wechseln
/accswitcher list    — Alle gespeicherten Accounts auflisten
/accswitcher remove  — Account entfernen
/accswitcher token   — Aktuellen Token anzeigen (benötigt Unsafe Features)
```

---

## Credits

- Original MoreAlts Konzept von **Win8.1VMUser**
- Komplett neu geschrieben von **Cordinsanity**

> ⚠️ Account-Switching verstößt gegen Discords ToS. Auf eigene Gefahr nutzen.
