---
name: HeroUI migration frontend
overview: Installer HeroUI v3 (et Tailwind v4) dans le frontend Vite/React, puis remplacer tous les éléments UI actuels par les composants HeroUI correspondants, en incluant un bouton d’upload avec état de chargement (Spinner + isPending) comme demandé.
todos: []
isProject: false
---

# Plan : migration du frontend vers HeroUI v3

## Analyse préliminaire – éléments remplaçables

Inventaire des éléments UI actuels et du composant HeroUI à utiliser pour chacun.


| Fichier             | Élément actuel                              | Remplacement HeroUI                                                                                         |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Navbar.jsx**      | `<nav>` + divs                              | `Navbar`, `Navbar.Brand`, `Navbar.Content` (ou structure compound)                                          |
|                     | Texte "Photos API"                          | Contenu de `Navbar.Brand`                                                                                   |
|                     | `<span>` email user                         | `Chip` ou `User` / texte dans un conteneur Navbar                                                           |
|                     | `<button>` Déconnexion                      | `Button` variant outline / bordered                                                                         |
|                     | `<button>` Se connecter                     | `Button` variant primary / solid                                                                            |
| **LoginForm.jsx**   | Overlay + div modal                         | `Modal` (isOpen, onClose)                                                                                   |
|                     | `<h2>` Connexion                            | Titre du `Modal` (header)                                                                                   |
|                     | `<input type="email">`                      | `Input` (type="email", label, placeholder)                                                                  |
|                     | `<input type="password">`                   | `Input` (type="password", label)                                                                            |
|                     | `<p className="login-error">`               | `Alert` ou état `error` sur les Input / texte sous le formulaire                                            |
|                     | `<button>` Annuler                          | `Button` variant outline, onPress = fermer modal                                                            |
|                     | `<button>` Se connecter (loading)           | `Button` avec `isPending`, rendu enfants `{({ isPending }) => ...}` + `Spinner` (comme ton exemple Loading) |
| **FileForm.jsx**    | `<section>` + `<h2>` + `<p>` (non connecté) | `Card`, `Card.Header` / titre, `Card.Body` avec `Text`                                                      |
|                     | `<form>` + label + input file + button      | `Card` pour la section, `Input` type="file" si disponible, sinon input natif stylisé ; `Button` submit      |
|                     | `<button>` Envoyer la photo                 | `Button` avec `isPending` pendant l’upload + `Spinner` (même pattern que Loading)                           |
| **LatestImage.jsx** | `<section>` + `<h2>`                        | `Card` + en-tête (titre)                                                                                    |
|                     | `<img>`                                     | `Image` HeroUI si disponible, sinon `<img>` dans `Card.Body`                                                |
|                     | `<p>` (état vide)                           | `Card.Body` + `Text`                                                                                        |


Référence du pattern Loading demandé (à réutiliser pour tout bouton avec chargement) :

```jsx
<Button isPending>
  {({ isPending }) => (
    <>
      {isPending ? <Spinner color="current" size="sm" /> : null}
      Uploading...
    </>
  )}
</Button>
```

À appliquer pour : **LoginForm** (bouton "Se connecter") et **FileForm** (bouton "Envoyer la photo" avec état `uploading`).

---

## Étape 1 – Installation et configuration HeroUI + Tailwind v4

- **Dépendances** (dans [frontend/package.json](frontend/package.json)) :
  - `@heroui/react`
  - `@heroui/styles` (styles de base HeroUI)
  - Tailwind CSS v4 : `tailwindcss` (v4), `@tailwindcss/vite` pour l’intégration Vite
- **Configuration Vite** ([frontend/vite.config.js](frontend/vite.config.js)) : ajouter le plugin Tailwind v4 pour Vite si requis par la doc officielle.
- **CSS global** ([frontend/src/index.css](frontend/src/index.css) ou point d’entrée CSS) :
  - `@import "tailwindcss";`
  - `@import "@heroui/styles";`
- Vérifier la doc HeroUI v3 (installation + Tailwind v4 + Vite) pour les commandes exactes (`pnpm add` / `npm install`) et l’ordre des imports.

Référence : [HeroUI Tailwind v4](https://heroui.com/docs/guide/tailwind-v4), [HeroUI Installation](https://heroui.com/docs/guide/installation), [HeroUI Vite](https://heroui.com/docs/frameworks/vite).

---

## Étape 2 – Navbar

- Fichier : [frontend/src/components/Navbar.jsx](frontend/src/components/Navbar.jsx).
- Remplacer la structure actuelle par les composants HeroUI :
  - `Navbar` comme conteneur principal.
  - `Navbar.Brand` (ou équivalent) pour "Photos API".
  - Zone droite : si connecté, afficher l’email (texte ou `Chip`) + `Button` "Déconnexion" (variant bordered/outline) ; sinon `Button` "Se connecter" (variant solid/primary) qui appelle `setShowLogin(true)`.
- Supprimer les classes CSS custom de la navbar (ou les garder uniquement pour ajustements mineurs) et s’appuyer sur les props HeroUI (variant, color, etc.).

---

## Étape 3 – LoginForm (Modal + formulaire)

- Fichier : [frontend/src/components/LoginForm.jsx](frontend/src/components/LoginForm.jsx).
- Remplacer l’overlay + div modal par un **Modal** HeroUI :
  - Contrôle d’ouverture/fermeture via props (ex. `isOpen={true}` / `onOpenChange` ou `onClose`) reliées à `setShowLogin`.
  - Clic sur le backdrop = fermer (comportement par défaut du Modal).
- Contenu du modal :
  - Titre : "Connexion" (composant header du Modal ou `Modal.Title` si disponible).
  - **Input** HeroUI pour l’email (label "Email", placeholder `user1@example.com`, `type="email"`, value/onChange).
  - **Input** HeroUI pour le mot de passe (label "Mot de passe", `type="password"`, value/onChange).
  - Affichage de l’erreur : **Alert** ou simple `Text` avec `color="danger"` sous les champs.
  - Deux **Button** :
    - "Annuler" : variant outline, `onPress` = fermer le modal (`setShowLogin(false)`).
    - "Se connecter" : variant primary, `isPending={loading}`, enfants en fonction de `isPending` avec **Spinner** (pattern identique à ton composant Loading).
- Conserver la logique actuelle (fetch `POST /users/sign_in`, lecture du header Authorization, `localStorage`, `setUser`, `setShowLogin(false)`).

---

## Étape 4 – FileForm (Card + formulaire + bouton chargement)

- Fichier : [frontend/src/components/FileForm.jsx](frontend/src/components/FileForm.jsx).
- **État** : ajouter un state `uploading` (boolean), mis à `true` au début de `submitToAPI` et à `false` dans `.finally()` (ou équivalent).
- **Cas non connecté** :
  - Remplacer section/h2/p par une **Card** HeroUI : titre "Uploader une photo", corps avec un **Text** expliquant de se connecter via la navbar.
- **Cas connecté** :
  - Même **Card** avec titre "Uploader une photo".
  - Formulaire : garder l’input file natif (ou utiliser un composant HeroUI type file si documenté) ; pour le bouton submit, utiliser **Button** avec `isPending={uploading}` et le même pattern que Loading : `{({ isPending }) => (<> { isPending ? <Spinner color="current" size="sm" /> : null } Envoyer la photo </>)}`.
- Gestion d’erreur : garder `window.alert` ou remplacer par une **Alert** HeroUI temporaire si tu veux tout en composants.

---

## Étape 5 – LatestImage (Card + Image / texte)

- Fichier : [frontend/src/components/LatestImage.jsx](frontend/src/components/LatestImage.jsx).
- Remplacer la section par une **Card** HeroUI :
  - En-tête : "Dernière photo".
  - Corps : si `latestPost` existe, afficher l’image avec le composant **Image** HeroUI (si disponible et adapté) ou `<img>` dans la Card ; sinon afficher un **Text** pour l’état vide ("Aucune photo pour le moment...").
- Conserver la logique `useEffect` et `setLatestPost` inchangée.

---

## Étape 6 – Nettoyage CSS et cohérence

- Dans [frontend/src/App.css](frontend/src/App.css) : supprimer ou réduire les styles devenus inutiles (boutons, navbar, modal, etc.) et ne garder que ce qui complète HeroUI (espacements, layout racine, classes spécifiques au projet si besoin).
- Vérifier que le thème (couleurs, espacements) reste cohérent ; si HeroUI est en dark/light, s’assurer que l’app reste lisible (variables CSS ou thème par défaut).

---

## Résumé des composants HeroUI à utiliser

- **Navbar** (structure compound si doc v3)
- **Button** (primary, outline, `isPending` + enfants avec Spinner)
- **Spinner** (dans les boutons de chargement)
- **Modal** (connexion)
- **Input** (email, password)
- **Card** (sections upload + dernière photo)
- **Text** / **Alert** (messages, erreurs)
- **Image** (optionnel, si présent dans HeroUI v3 pour LatestImage)
- **Chip** (optionnel, pour l’email dans la navbar)

Ordre d’implémentation recommandé : 1 → 2 → 3 → 4 → 5 → 6. Après validation du plan, l’implémentation pourra suivre cette checklist et la doc officielle HeroUI v3 pour les APIs exactes (noms des sous-composants, props).