# Grace WAKEZO & Esther KHONDE — HTML, CSS et JavaScript

Conversion de la version 4 de l’invitation, commit `ee3330f8c2b48c72538d82e63bb0b92200a523a0`.

L’invitation conserve les règles CSS d’origine, le fond ivoire continu avec les motifs botaniques, les quatre horaires centrés avec leurs icônes, les trois photos du couple, les icônes vestimentaires et les polices originales. Les seules différences dans le CSS public sont les chemins relatifs des ressources. Les fichiers d’image et de police sont identiques à ceux de l’archive fournie.

La version convertie ne dépend plus de React, Next, Vinext, Vite, TypeScript ou Cloudflare. Elle utilise du HTML, du CSS et du JavaScript natif. Les fonctions qui ont besoin de données partagées disposent d’un serveur JavaScript avec une base SQLite.

## Voir l’invitation immédiatement

Décompressez le ZIP puis ouvrez **`index.html`** dans votre navigateur. Gardez `styles.css`, `script.js`, les photos, les polices et le dossier `assets` à leurs emplacements.

Ce mode permet de consulter l’invitation, son programme et ses photos, de remplir le formulaire et de télécharger le calendrier. Pour enregistrer une confirmation, vérifier une invitation nominative ou administrer les invités, lancez le serveur ci-dessous. Une ouverture par double-clic ne prétend jamais avoir enregistré une réponse.

## Lancer toutes les fonctions

Installez **Node.js 24 ou supérieur**, puis ouvrez un terminal dans ce dossier et lancez :

```sh
npm start
```

Ouvrez **http://localhost:5173**. Aucune installation de dépendances et aucune compilation ne sont nécessaires.

La base `data/rsvp.sqlite` et ses tables sont créées automatiquement au premier lancement. La base est vide au départ ; aucune donnée d’invité du Site d’origine n’a été exportée.

Pour utiliser l’espace organisateur, arrêtez le serveur (`Ctrl+C`) puis lancez :

```sh
npm run admin:setup
npm start
```

La première commande crée un mot de passe aléatoire et l’affiche une seule fois. Conservez-le dans votre gestionnaire de mots de passe. Elle enregistre uniquement son empreinte dans `.env`. Ouvrez ensuite **http://localhost:5173/admin/** et connectez-vous.

Un mot de passe existant n’est jamais remplacé par cette commande. L’administration reste verrouillée tant qu’aucun mot de passe n’est configuré.

## Fonctions conservées

- Formulaire RSVP : validation, consentement, préférence de boisson, chanson, message et confirmation après enregistrement réel.
- Mise à jour d’une réponse existante, protection contre les envois trop rapides et champ anti-robot.
- Invitations nominatives vérifiées par un code aléatoire, nom et téléphone fixes lorsqu’ils sont renseignés, table et nombre de personnes.
- Création et modification des invités, ajout d’une liste, création et renommage des tables, affectations et suppressions.
- Statistiques, réponses consultables, recherche et filtres, classement des boissons et des chansons, export CSV.
- Liens WhatsApp à vérifier puis à envoyer manuellement.
- QR code personnel et contrôle d’entrée avec détection des doublons ; saisie manuelle si le navigateur ne propose pas de scanner.
- Calendrier avec deux événements le 17 octobre 2026 : mise en place à 09h30 et à 19h30, heure de Kinshasa.

Les QR codes utilisent le même service externe que l’original (`api.qrserver.com`) et nécessitent Internet. La caméra QR dépend de la disponibilité de `BarcodeDetector` et de l’autorisation de caméra du navigateur. Les informations de confidentialité ont été adaptées à ce serveur autonome.

L’authentification « Sign in with ChatGPT » a été remplacée par une connexion administrateur avec mot de passe et cookie de session. Les anciens en-têtes d’identité Sites ne donnent aucun accès sur ce serveur.

## Où modifier les fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Export HTML complet de l’invitation, consultable sans serveur |
| `styles.css` | Style public, responsive, fond continu et centrage |
| `script.js` | Formulaire RSVP, choix de présence, modal et accès clavier |
| `site-config.js` | Noms, date, lieux, programme, couleurs et paramètres de l’événement |
| `server/views/invitation.js` | Génération HTML native de l’invitation servie par Node, avec personnalisation vérifiée |
| `privacy.html` et `server/views/privacy.js` | Confidentialité : export et version servie |
| `admin.css` | Styles de l’espace organisateur d’origine |
| `server/views/admin-*.js` | Pages de gestion générées en HTML par des fonctions JavaScript natives |
| `assets/js/` | Recherche, filtres, formulaires de gestion et contrôle d’entrée |
| `server.js` | Serveur HTTP, routes et accès aux fichiers publics |
| `server/api/` | Enregistrement des RSVP, administration, calendrier et export CSV |
| `server/database.js` et `server/migrations/` | Base SQLite et migrations d’origine |
| `photos/`, `fonts/`, `assets/icons/`, `assets/images/` | Ressources visuelles originales |

**Pour faire évoluer le site avec son serveur**, modifiez `site-config.js`, `styles.css`, `script.js` et, si nécessaire, les fonctions HTML dans `server/views/`. Le contenu public est rendu par ces fonctions, sans React et sans JSX.

Après une modification de contenu ou de structure, régénérez les fichiers HTML statiques et le calendrier :

```sh
npm run export:static
```

Cette commande remplace `index.html`, `privacy.html`, les pages statiques `admin/*.html` et `mariage.ics`. Une modification directe de `index.html` suffit pour l’aperçu statique ; reportez-la dans `server/views/invitation.js` si vous utilisez aussi le serveur. `npm run dev` relance automatiquement le serveur lors des changements.

## Héberger cette version

Pour l’invitation visuelle seule, vous pouvez copier les fichiers publics sur un hébergement statique. Les confirmations et l’administration demandent un hébergement capable d’exécuter **Node.js 24+**, avec un disque persistant pour SQLite. Le serveur sert le site à la racine du domaine.

Exemple de `.env` pour votre propre hébergement :

```dotenv
HOST=0.0.0.0
PORT=5173
PUBLIC_URL=https://votre-domaine.example
# ADMIN_PASSWORD_HASH est créé par npm run admin:setup
```

Configurez HTTPS avec votre hébergeur ou votre proxy ; la session utilise un cookie sécurisé quand `PUBLIC_URL` est une adresse HTTPS. Les liens d’invitation et WhatsApp utilisent cette adresse. `PUBLIC_URL` accepte une origine sans sous-dossier.

Le serveur ne rend publics ni `.env`, ni le code serveur, ni la base SQLite. Sauvegardez le dossier `data` pour conserver les confirmations. Ne copiez pas `.env` ou `data` dans un répertoire distribué par un hébergement statique. Le présent ZIP ne contient ni mot de passe actif ni données de production.

## Vérifications

```sh
npm test
```

Les tests utilisent une base temporaire, indépendante de vos invités : ressources et calendrier, accès administrateur, tables, invitations nominatives, persistance des RSVP après redémarrage, validation, protection contre un envoi depuis une autre origine, contrôle d’entrée, CSV et déconnexion.

`ASSETS_ORIGINAUX.json` contient les empreintes SHA-256 des ressources conservées. `VERSION_SOURCE.json` identifie précisément l’archive et la version de départ.

Documentation technique : https://nodejs.org/docs/latest-v24.x/api/sqlite.html et https://nodejs.org/docs/latest-v24.x/api/http.html.
