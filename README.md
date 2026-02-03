# Système de Formulaire d'Avis Clients

Application web complète pour collecter et gérer les avis clients avec interface d'administration.

## 🚀 Fonctionnalités

### Formulaire Public
- ✅ Évaluation par étoiles (1-5) sur 5 critères
- ✅ Champ de suggestions optionnel
- ✅ Design responsive et moderne
- ✅ Envoi automatique d'email à l'entreprise

### Interface d'Administration
- ✅ Authentification JWT sécurisée
- ✅ Dashboard avec statistiques des avis
- ✅ Gestion complète des utilisateurs (CRUD)
- ✅ Rôles : SuperAdmin et Admin
- ✅ Interface mobile-friendly

## 🛠️ Technologies

**Backend**
- Django 4.2.7 + Django REST Framework
- JWT Authentication
- SQLite (développement)
- API Resend pour les emails

**Frontend**
- React 18
- Axios pour les requêtes API
- CSS moderne avec animations

## 📁 Structure du Projet

```
Formulaire/
├── backend/           # Configuration Django
├── api/              # API Django + Modèles
├── frontend/         # Application React
├── venv/             # Environnement virtuel Python
├── requirements.txt  # Dépendances Python
├── .env             # Variables d'environnement
├── start-backend.bat # Script démarrage backend
└── start-frontend.bat # Script démarrage frontend
```

## 🚀 Installation et Démarrage

### Méthode Rapide
1. Double-cliquez sur `start-backend.bat`
2. Double-cliquez sur `start-frontend.bat`
3. Ouvrez http://localhost:3000

### Méthode Manuelle

#### Backend Django
```bash
# Activer l'environnement virtuel
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

#### Frontend React
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

### Variables d'Environnement (.env)
```
SECRET_KEY=votre-cle-secrete-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
RESEND_API_KEY=votre-cle-api-resend
EMAIL_FROM=noreply@votre-domaine.com
EMAIL_TO=admin@votre-domaine.com
```

### Endpoints API
- `POST /api/login/` - Connexion administrateur
- `GET /api/avis/` - Liste des avis (authentifié)
- `POST /api/avis/` - Soumission d'avis (public)
- `GET/POST/PUT/DELETE /api/users/` - Gestion utilisateurs (superadmin)

## 🌐 Déploiement

### Modifications pour la Production

1. **backend/settings.py**
```python
DEBUG = False
ALLOWED_HOSTS = ['votre-domaine.com']
```

2. **api/views.py** (optionnel)
```python
# Ligne 158 : Votre clé API Resend
'Authorization': 'Bearer VOTRE_CLE_API',
# Ligne 164 : Votre email
'to': ['votre-email@example.com'],
```

### Plateformes Recommandées
- **Railway** (le plus simple)
- **Heroku**
- **DigitalOcean App Platform**

## 👥 Utilisation

### Accès Public
- Formulaire d'avis : http://localhost:3000

### Accès Administration
- Interface admin : http://localhost:3000/admin
- Connexion avec les identifiants du superutilisateur créé

### Rôles Utilisateurs
- **SuperAdmin** : Gestion complète des utilisateurs + dashboard
- **Admin** : Accès au dashboard des avis uniquement

## 📧 Configuration Email

Par défaut, les emails s'affichent dans la console Django (développement).
Pour la production, configurez Resend avec une vraie clé API.

## 🔒 Sécurité

- Authentification JWT avec tokens d'accès et de rafraîchissement
- Validation des permissions par rôle
- Protection CORS configurée
- Validation des données côté serveur

## 📱 Compatibilité

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Android Chrome)
- ✅ Tablette (iPad, Android)

## 🆘 Support

Le système est prêt pour la production et l'hébergement immédiat.