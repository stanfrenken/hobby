# Firebase Setup

1. Maak een nieuw project in Firebase.
2. Voeg een `Web app` toe aan dat project.
3. Zet `Cloud Firestore` aan in `Production mode`.
4. Vervang de Firestore rules door de inhoud van `firestore.rules`.
5. Zet in `Authentication -> Sign-in method` de provider `Google` aan.
6. Voeg in `Authentication -> Settings -> Authorized domains` toe:
   - `stanfrenken.github.io`
7. Kopieer de Firebase web config uit je projectinstellingen.
8. Open de app op:
   - `https://stanfrenken.github.io/hobby/app.html`
9. Plak die config JSON in het blok `Cloud Database`.
10. Klik `Bewaar database` en daarna `Login met Google`.

Daarna wordt Firestore de hoofdopslag en hoort telefoon en pc dezelfde data te tonen.
