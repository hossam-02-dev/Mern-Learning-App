/**
 * @swagger
 * tags:
 *   - name: Authentification
 *     description: Gestion de l'inscription, la connexion et la session utilisateur.
 *   - name: Cours
 *     description: Gestion des cours (création, modification, suppression, consultation).
 *   - name: Progression
 *     description: Suivi de la progression des utilisateurs dans les cours.
 *   - name: Quiz
 *     description: Gestion des quiz liés aux cours.
 *   - name: Paiement
 *     description: Gestion des paiements via Stripe.
 *   - name: Utilisateur
 *     description: Gestion des profils utilisateurs.
 */

/**
 * ======================
 *  AUTH ROUTES
 * ======================
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 example: "dupont@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "dupont@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie, token renvoyé.
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token JWT
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Nouveau token généré.
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 */


/**
 * ======================
 *  COURSE ROUTES
 * ======================
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Récupérer tous les cours
 *     tags: [Cours]
 *     responses:
 *       200:
 *         description: Liste de tous les cours.
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Récupérer un cours par ID
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du cours trouvé.
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Créer un nouveau cours
 *     tags: [Cours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Introduction à React"
 *               description:
 *                 type: string
 *                 example: "Cours complet pour apprendre React."
 *               categorie:
 *                 type: string
 *                 example: "Développement Web"
 *     responses:
 *       201:
 *         description: Cours créé avec succès.
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Modifier un cours existant
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "React avancé"
 *               description:
 *                 type: string
 *                 example: "Mise à jour du contenu du cours."
 *     responses:
 *       200:
 *         description: Cours modifié avec succès.
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Supprimer un cours
 *     tags: [Cours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Cours supprimé.
 */


/**
 * ======================
 *  PROGRESSION ROUTES
 * ======================
 */

/**
 * @swagger
 * /api/progress/users/{id}:
 *   get:
 *     summary: Récupérer la progression de tous les cours d’un utilisateur
 *     tags: [Progression]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Progression de l'utilisateur récupérée.
 */

/**
 * @swagger
 * /api/progress/courses/{id}:
 *   get:
 *     summary: Récupérer la progression des utilisateurs dans un cours
 *     tags: [Progression]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Progression récupérée.
 */

/**
 * @swagger
 * /api/progress:
 *   post:
 *     summary: Créer une nouvelle progression
 *     tags: [Progression]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "6549f1..."
 *               courseId:
 *                 type: string
 *                 example: "abcd123..."
 *               pourcentage:
 *                 type: number
 *                 example: 60
 *     responses:
 *       201:
 *         description: Progression créée avec succès.
 */


/**
 * ======================
 *  QUIZ ROUTES
 * ======================
 */

/**
 * @swagger
 * /api/quiz:
 *   post:
 *     summary: Créer un nouveau quiz pour un cours
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "abcd123..."
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "Qu’est-ce que React ?"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Librairie", "Framework"]
 *                     reponse:
 *                       type: string
 *                       example: "Librairie"
 *     responses:
 *       201:
 *         description: Quiz créé avec succès.
 */

/**
 * @swagger
 * /api/quiz/courses/{id}:
 *   get:
 *     summary: Récupérer le quiz d’un cours
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Quiz trouvé.
 */


/**
 * ======================
 *  PAIEMENT ROUTES
 * ======================
 */

/**
 * @swagger
 * /api/paiement:
 *   get:
 *     summary: Récupérer tous les paiements (admin uniquement)
 *     tags: [Paiement]
 *     responses:
 *       200:
 *         description: Liste de tous les paiements.
 */

/**
 * @swagger
 * /api/paiement/{id}:
 *   get:
 *     summary: Récupérer un paiement par ID
 *     tags: [Paiement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Paiement trouvé.
 */

/**
 * @swagger
 * /api/paiement/checkout:
 *   post:
 *     summary: Démarrer un paiement avec Stripe
 *     tags: [Paiement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paiement initié avec succès.
 */

/**
 * @swagger
 * /api/paiement/verify:
 *   post:
 *     summary: Vérifier le statut d’un paiement
 *     tags: [Paiement]
 *     responses:
 *       200:
 *         description: Paiement vérifié.
 */


/**
 * ======================
 *  USER ROUTES
 * ======================
 */

/**
 * @swagger
 * /api/User:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin)
 *     tags: [Utilisateur]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs.
 */

/**
 * @swagger
 * /api/User/{id}:
 *   get:
 *     summary: Récupérer le profil d’un utilisateur (student)
 *     tags: [Utilisateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Profil récupéré.
 */

/**
 * @swagger
 * /api/User/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin)
 *     tags: [Utilisateur]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Utilisateur supprimé.
 */

/**
 * @swagger
 * /api/User/me:
 *   put:
 *     summary: Mettre à jour son propre profil
 *     tags: [Utilisateur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Nouveau Nom"
 *               email:
 *                 type: string
 *                 example: "nouveau@example.com"
 *     responses:
 *       200:
 *         description: Profil mis à jour.
 */
