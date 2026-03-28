# Google Drive JSON Setup

Gebruik deze app via:
- `https://stanfrenken.github.io/hobby/app.html`

## 1. Maak een Google Cloud project
1. Open de Google Cloud Console.
2. Maak een nieuw project aan, of kies een bestaand project.

## 2. Zet de Google Drive API aan
1. Ga naar `APIs & Services`.
2. Kies `Library`.
3. Zoek op `Google Drive API`.
4. Klik `Enable`.

## 3. Maak een OAuth Client ID voor web
1. Ga naar `APIs & Services`.
2. Kies `Credentials`.
3. Klik `Create Credentials`.
4. Kies `OAuth client ID`.
5. Kies `Web application`.
6. Voeg deze `Authorized JavaScript origin` toe:
   - `https://stanfrenken.github.io`
7. Sla op.

Je krijgt nu een `Client ID` die eindigt op `.apps.googleusercontent.com`.

## 4. Koppel de app
1. Open de fitness app op:
   - `https://stanfrenken.github.io/hobby/app.html`
2. Ga naar tab `Dashboard`.
3. Zoek het blok `Google Drive JSON`.
4. Plak deze JSON:

```json
{
  "clientId": "jouw-client-id.apps.googleusercontent.com"
}
```

5. Klik `Bewaar Drive-koppeling`.
6. Klik `Login met Google`.
7. Log in met het Google-account waarin je de data wilt bewaren.

## 5. Hoe het werkt
- De app bewaart alles in `appDataFolder` van jouw Google Drive.
- Dat is een verborgen app-map, dus je ziet het bestand normaal niet tussen je gewone Drive-bestanden.
- De data staat in een JSON-bestand met de naam `fitness-log.json`.
- De app blijft ook lokaal opslaan als extra buffer.

## 6. Gebruik op telefoon en pc
1. Open op beide apparaten dezelfde app-link.
2. Gebruik op beide apparaten hetzelfde Google-account.
3. Log op beide apparaten een keer in via `Login met Google`.

Daarna haalt de app bij inloggen en bij terugkomen naar het tabblad de nieuwste Drive-data op.
