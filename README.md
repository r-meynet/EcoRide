# 🌿 EcoRide – Application de covoiturage éco-responsable

Projet réalisé dans le cadre du **Titre Professionnel “Développeur Web et Web Mobile”** chez **STUDI**
👉 Évaluation **ECF**

Déploiement : [https://ecoride-ecf.netlify.app](https://ecoride-ecf.netlify.app)  
Auteur : **Rémy Meynet**  
Date : Novembre 2025

---

## 🚗 Présentation du projet

**EcoRide** est une application web de covoiturage axée sur la **mobilité verte** et la **simplicité d’usage**.  
Les utilisateurs peuvent rechercher, filtrer et consulter des trajets proposés par d’autres membres.  
L’application est **centrée sur le front-end** pour cette version ECF, avec une **base de données simulée** via un fichier `data.json`, car l'évaluation étant en cours de formation, je n'ai pas encore appréhendé la partie création de back-end.

---

## 🧭 Fonctionnalités principales

### ✅ Partie réalisée (MVP fonctionnel)
| Fonction | Description |
|-----------|--------------|
| 🔍 Recherche de trajets | Par ville de départ / arrivée / date |
| 📅 Filtrage avancé | Prix max, durée max, note minimale, véhicule électrique |
| 🧾 Page de détail | Informations complètes sur le trajet (conducteur, véhicule, préférences) |
| 🌱 Badge éco | Mise en avant des trajets effectués avec véhicule électrique |
| 🧠 Mémorisation des sélections | Session Storage entre pages |
| 🧭 Routage front | Navigation entre pages via `router.js` |
| 📱 Design responsive | Bootstrap 5.3 custom via SCSS |
| 📂 Données simulées | `data/data.json` jouant le rôle de base de données locale |
| 🚀 Déploiement | Hébergé sur Netlify (SPA `_redirects`) |

### 🔜 Partie non encore développée (Back & fonctionnalités avancées)
| Fonction | État |
|-----------|-------|
| Création de compte / connexion | 🕗 À implémenter côté back |
| Gestion des crédits | 🕗 À simuler dans une future API |
| Historique et avis | 🕗 Prévu dans le module utilisateur |
| Rôles Employé / Admin | 🕗 Maquettes et endpoints à documenter |
| Base de données SQL / NoSQL | 🕗 MCD + scripts fournis (projet à venir) |

---

## 🧱 Architecture du projet
```
ecoride/
├── data/
│ └── data.json # Simulation de la base de données
├── js/
│ ├── pages/ # Scripts par page
│ │ ├── home.js
│ │ ├── covoiturages.js
│ │ └── detail-covoiturage.js
│ ├── router/ # Routage client
│ │ ├── allRoutes.js
│ │ └── router.js
│ ├── components/ # Composants réutilisables
│ ├── helpers/ # Fonctions utilitaires
│ └── script.js # Initialisation globale
├── pages/ # Templates HTML partiels
│ ├── home.html
│ ├── covoiturages.html
│ ├── detail-covoiturage.html
│ ├── mentions.html
│ └── contact.html
├── scss/ # Styles SCSS (custom Bootstrap)
│ ├── _custom.scss
│ └── style.scss
├── images/ # Ressources graphiques
├── index.html # Page d'accueil
├── _redirects # Redirection Netlify (SPA)
└── README.md
```
---

## 🧩 Technologies utilisées

| Domaine | Outils |
|----------|--------|
| **Front-end** | HTML5, SCSS, Bootstrap 5.3, JavaScript |
| **Routage SPA** | Custom Router (history API + `_redirects` Netlify) |
| **Simulation API** | `data.json` + Fetch |
| **Stockage local** | `sessionStorage`, cookies |
| **Déploiement** | Netlify |
| **Maquettage** | Figma, draw.io |
| **Gestion de version** | Git + branches `dev` / `main` / `feature/*` |

---

## ⚙️ Installation et exécution locale

### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/ton-profil/ecoride.git
```
### 2️⃣ Lancer un serveur local
Utiliser une extension comme Live Server (VSCode)
ou en ligne de commande :
```bash
npx serve
```
### 3️⃣ Accéder à l’application
```bash
Ouvrir http://localhost:3000
```

---

## 🌐 Déploiement Netlify

Dépôt Git connecté à Netlify
Build command : (aucune — projet statique)
Publish directory : /
Fichier _redirects :
/*    /index.html   200

---

## 📘 Documentation complémentaire (fournie dans la copie à rendre)

Charte graphique & maquettes Figma (6 écrans)
Manuel utilisateur PDF
Lien Netlify + identifiants de démo
Lien Trello / Notion (gestion de projet)

---

## 👨‍💻 Auteur

Rémy MEYNET
📧 remy.meynet@outlook.fr

---

## 📄 Licence

Projet open-source sous licence MIT – libre d’utilisation à des fins pédagogiques.