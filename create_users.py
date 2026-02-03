from django.contrib.auth.models import User

# Créer les utilisateurs
users_data = [
    {'username': 'admin', 'password': 'admin123', 'is_staff': True, 'is_superuser': True},
    {'username': 'manager', 'password': 'manager123', 'is_staff': True},
    {'username': 'owner', 'password': 'owner123', 'is_staff': True},
]

for user_data in users_data:
    if not User.objects.filter(username=user_data['username']).exists():
        user = User.objects.create_user(
            username=user_data['username'],
            password=user_data['password'],
            is_staff=user_data.get('is_staff', False),
            is_superuser=user_data.get('is_superuser', False)
        )
        print(f"Utilisateur {user.username} créé avec succès")
    else:
        print(f"Utilisateur {user_data['username']} existe déjà")