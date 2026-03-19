# Fitness Daglog

Een compacte fitness tracker die je per dag oefeningen, sets, reps en gewicht laat loggen, met automatische totals en progress-grafiek.

## Starten
Open `index.html` in je browser.

## Google Sheets Sync
De Apps Script backend staat in `google-apps-script.gs`.

Kernstappen:
1. Maak een Google Sheet en kopieer de Sheet ID (uit de URL).
2. Open Extensions -> Apps Script en plak de code uit `google-apps-script.gs`.
3. Deploy als Web App (Execute as: Me, Who has access: Anyone) en kopieer de Web App URL.
4. Vul in de app de Web App URL en Sheet ID in.

## GitHub Pages
1. Push deze repo naar GitHub.
2. Ga naar Settings -> Pages.
3. Kies `main` branch, `/ (root)`.
4. Je site staat daarna op de GitHub Pages URL.
