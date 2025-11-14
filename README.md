# 🎓 ClairSavoir - Plateforme d'apprentissage en ligne

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen)
![React](https://img.shields.io/badge/React-v18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v6-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 À propos

ClairSavoir est une plateforme complète d'e-learning développée avec le stack MERN (MongoDB, Express.js, React.js, Node.js). Elle permet aux professeurs de créer et gérer des cours, et aux étudiants de suivre leur progression à travers des vidéos, documents et quiz interactifs.

**🎯 Ce projet représente mon deuxième projet MERN, développé pour consolider mes compétences full-stack avant ma transition vers Spring Boot.**

## ✨ Fonctionnalités principales

### 👨‍🎓 Espace Étudiant
- ✅ Inscription et authentification sécurisée (JWT)
- ✅ Navigation et recherche de cours
- ✅ Achat de cours (gratuits ou payants)
- ✅ Suivi de progression en temps réel avec barre de progression
- ✅ Quiz interactifs avec correction automatique
- ✅ Tableau de bord personnalisé avec statistiques

### 👨‍🏫 Espace Professeur
- ✅ Création et gestion complète de cours (CRUD)
- ✅ Upload de vidéos (MP4) et documents (PDF)
- ✅ Gestion de miniatures pour les cours
- ✅ Création de quiz personnalisés
- ✅ Suivi des étudiants inscrits
- ✅ Dashboard avec statistiques de revenus

### 👨‍💼 Espace Administrateur
- ✅ Gestion complète des utilisateurs
- ✅ Modération et validation des cours
- ✅ Dashboard avec métriques (utilisateurs, revenus, activité)
- ✅ Historique des paiements et transactions

## 🛠️ Technologies utilisées

### Backend
| Technologie | Usage |
|------------|-------|
| **Node.js** & **Express.js** | Serveur et API REST |
| **MongoDB** & **Mongoose** | Base de données NoSQL avec ODM |
| **JWT (jsonwebtoken)** | Authentification stateless |
| **bcrypt** | Hachage sécurisé des mots de passe |
| **Swagger** | Documentation API interactive |
| **Morgan** | Logging HTTP des requêtes |
| **Multer** | Gestion des uploads de fichiers |

### Frontend
| Technologie | Usage |
|------------|-------|
| **React.js** | Bibliothèque UI |
| **Context API** | State management global |
| **React Router v6** | Routing et navigation |
| **Tailwind CSS 4** | Framework CSS utility-first |
| **Axios** | Client HTTP |
| **Lucide React** | Bibliothèque d'icônes |

## 📦 Installation et démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn
- Git

### 1️⃣ Cloner le repository
```bash
git clone https://github.com/hossam-02-dev/Mern-Learning-App-MonoRepo.git
cd Mern-Learning-App-MonoRepo
```

### 2️⃣ Configuration du Backend
```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend/` :
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/clairsavoir
JWT_SECRET=votre_secret_jwt_ultra_securise_changez_moi
```

Démarrez le serveur :
```bash
npm start
```

Le backend sera accessible sur `http://localhost:4000`

### 3️⃣ Configuration du Frontend
```bash
cd ../frontend
npm install
```

Démarrez l'application React :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du projet
```
Mern-Learning-App-MonoRepo/
│
├── backend/                    # API Node.js + Express
│   ├── controllers/           # Logique métier
│   ├── models/               # Modèles Mongoose
│   ├── routes/               # Routes API
│   ├── middleware/           # Auth, validation, error handling
│   ├── uploads/              # Fichiers uploadés (vidéos, PDFs, images)
│   ├── config/               # Configuration (DB, Swagger)
│   ├── .env                  # Variables d'environnement
│   └── server.js             # Point d'entrée du serveur
│
├── frontend/                  # Application React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── Auth/        # Login, Register
│   │   │   ├── Courses/     # Gestion des cours
│   │   │   ├── Dashboard/   # Tableaux de bord
│   │   │   ├── Quiz/        # Système de quiz
│   │   │   └── Users/       # Profils utilisateurs
│   │   ├── apis/            # Appels API (Axios)
│   │   ├── Contexts/        # Context API (Auth, State)
│   │   ├── App.jsx          # Composant racine
│   │   └── main.jsx         # Point d'entrée
│   ├── public/              # Assets statiques
│   └── index.html
│
└── README.md                 # Ce fichier
```

## 🔐 Variables d'environnement

### Backend (.env)
```env
# Serveur
PORT=4000

# Base de données
MONGO_URI=mongodb://localhost:27017/clairsavoir
# Ou pour MongoDB Atlas :
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clairsavoir

# Sécurité
JWT_SECRET=votre_secret_jwt_minimum_32_caracteres_aleatoires
JWT_EXPIRE=7d

# Optionnel
NODE_ENV=development
```

### Frontend (optionnel - si vous voulez configurer l'URL de l'API)
Créez un fichier `.env` dans `frontend/` :
```env
VITE_API_URL=http://localhost:4000/api
```

## 📚 Documentation API

Une fois le backend lancé, accédez à la documentation interactive Swagger :
```
http://localhost:4000/api-docs
```

Vous y trouverez toutes les routes disponibles avec leurs paramètres et exemples.

## 🎯 Fonctionnalités techniques clés

### Sécurité
- 🔒 Authentification JWT avec tokens sécurisés
- 🔐 Hachage bcrypt avec salt rounds optimisés
- 🛡️ Validation des données avec middleware
- 🚫 Protection CORS configurée

### Architecture
- 📦 Architecture MVC propre et modulaire
- 🔄 Middleware chain pour le traitement des requêtes
- ⚡ Gestion centralisée des erreurs
- 📊 Logging détaillé avec Morgan

### Performance
- 🚀 Lazy loading des composants React
- 💾 Optimisation des requêtes MongoDB (indexes)
- 🎨 Design system cohérent avec Tailwind
- 📱 Interface 100% responsive

## 🚀 Déploiement

### Backend (Render / Railway / Heroku)
1. Créez un compte sur la plateforme
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement
4. Sélectionnez le dossier `backend/`
5. Déployez !

### Frontend (Vercel / Netlify)
1. Créez un compte sur la plateforme
2. Connectez votre repository GitHub
3. Build command : `npm run build`
4. Output directory : `dist`
5. Sélectionnez le dossier `frontend/`
6. Déployez !

## 📖 Guide d'utilisation

### Pour les étudiants
1. Créez un compte ou connectez-vous
2. Parcourez les cours disponibles
3. Achetez un cours (ou inscrivez-vous aux cours gratuits)
4. Suivez les vidéos et documents
5. Passez les quiz pour valider vos connaissances
6. Suivez votre progression dans votre dashboard

### Pour les professeurs
1. Créez votre compte professeur
2. Accédez à votre dashboard
3. Créez un nouveau cours avec titre, description, prix
4. Uploadez vos vidéos et documents PDF
5. Créez des quiz pour évaluer vos étudiants
6. Suivez les inscriptions et les statistiques

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrez une Pull Request

## 🐛 Bugs connus et améliorations futures

- [ ] Intégration d'un système de paiement réel (Stripe)
- [ ] Notifications en temps réel (Socket.io)
- [ ] Chat entre étudiants et professeurs
- [ ] Système de recommandation de cours
- [ ] Application mobile React Native

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 👨‍💻 Auteur

**Houssam**
- GitHub: [@hossam-02-dev](https://github.com/hossam-02-dev)
- LinkedIn: [Votre profil LinkedIn]

## 🙏 Remerciements

- Ce projet a été développé dans le cadre de mon apprentissage du stack MERN
- Deuxième itération de ma maîtrise du full-stack JavaScript
- Préparation à ma transition vers Spring Boot et l'écosystème Java

## 📊 Statistiques du projet

- **Lignes de code**: ~5000+
- **Composants React**: 30+
- **Routes API**: 25+
- **Durée de développement**: X semaines

---

⭐ **Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

💬 **Des questions ?** Ouvrez une issue ou contactez-moi directement.

🚀 **Prochaine étape** : Migration vers Spring Boot pour approfondir mes compétences backend Java !
