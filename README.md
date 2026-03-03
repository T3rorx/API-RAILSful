# API-RAILSful

API Rails JSON (THP) : blog avec articles, authentification JWT (devise-jwt), commentaires, photos et bonus monolithe React.

## Stack

- Ruby 3.x, Rails 8 (mode API)
- SQLite3, Devise + devise-jwt
- Active Storage (photos)
- Frontend bonus : React (Vite) dans `frontend/`

## Installation

```bash
bundle install
bin/rails db:create db:migrate db:seed
```

## Démarrer l’API

```bash
bin/rails s
# => http://localhost:3000
```

## Authentification (JWT)

- **Inscription** : `POST /users` avec `{ "user": { "email": "...", "password": "...", "password_confirmation": "..." } }`
- **Connexion** : `POST /users/sign_in` avec `{ "user": { "email": "...", "password": "..." } }`  
  Le token JWT est renvoyé dans l’en-tête **Authorization: Bearer &lt;token&gt;**.
- **Déconnexion** : `DELETE /users/sign_out` avec l’en-tête **Authorization: Bearer &lt;token&gt;** pour révoquer le token.

Pour les requêtes protégées (création/édition/suppression d’articles, etc.), envoyer l’en-tête :

`Authorization: Bearer <votre_token>`

## Endpoints principaux

| Méthode | Route | Description |
|--------|--------|-------------|
| GET | /articles | Liste des articles (privés exclus si non propriétaire) |
| GET | /articles/:id | Détail d’un article |
| POST | /articles | Créer un article (auth) |
| PATCH | /articles/:id | Modifier un article (propriétaire) |
| DELETE | /articles/:id | Supprimer un article (propriétaire) |
| GET | /articles/:article_id/comments | Commentaires d’un article |
| POST | /articles/:article_id/comments | Créer un commentaire (auth) |
| PATCH/DELETE | /articles/:article_id/comments/:id | Modifier/supprimer (auteur du commentaire) |
| GET/POST | /photos | Liste / création de photos (auth pour POST) |
| GET | /latest | Dernière photo (image_url) pour le frontend bonus |

## Bonus

- **Validations** : `title`, `content` (articles), `email` (users), `body` (comments).
- **Articles privés** : champ `is_private` ; visibles uniquement par le propriétaire (index/show filtrés).
- **Commentaires** : modèle `Comment` (user, article, body), routes imbriquées sous `/articles/:id/comments`.
- **Photos** : modèle `Photo` avec `has_one_attached :image`, CRUD réservé au propriétaire.

## Frontend bonus (monolithe React)

Navbar avec **Se connecter** / **Déconnexion**, formulaire de connexion (email + mot de passe → JWT), affichage de la dernière photo et upload réservé aux utilisateurs connectés.

### Lancer le frontend (Vite)

Depuis la racine du projet :

```bash
cd frontend
npm install
npm run dev
```

Ou avec pnpm :

```bash
cd frontend
pnpm install
pnpm run dev
```

Le front tourne sur **http://localhost:3001**. Si le port 3000 est pris par un autre outil, Vite propose un autre port au premier lancement.

**Important :** lance d’abord l’API Rails (`bin/rails s` sur le port 3000) avant d’ouvrir le front, sinon la connexion et l’upload ne marcheront pas.

- **Connexion** : bouton « Se connecter » dans la barre → email (ex. `user1@example.com`) et mot de passe (`password123` avec le seed).
- **Upload** : une fois connecté, formulaire « Uploader une photo » pour envoyer une image (POST `/photos`).
- **Dernière photo** : affichée en dessous ; mise à jour après chaque upload.

## Tests

```bash
bin/rails test
```

## Seed

- 3 users (`user1@example.com` … `user3@example.com`, mot de passe `password123`).
- 30 articles (Faker), répartis entre ces users.
