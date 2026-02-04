import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Avis
from api.serializers import AvisSerializer

# Test 1: Créer un avis directement
print("=== TEST 1: Création directe ===")
avis_test = Avis.objects.create(
    qualite_service=5,
    accueil_personnel=4,
    rapidite=3,
    rapport_qualite_prix=4,
    satisfaction_globale=5,
    suggestions="Test suggestions",
    connu_facebook=True,
    connu_instagram=False,
    connu_tiktok=True,
    connu_amis=False,
    connu_autres=False
)
print(f"Avis créé - ID: {avis_test.id}")
print(f"Facebook: {avis_test.connu_facebook}")
print(f"TikTok: {avis_test.connu_tiktok}")

# Test 2: Vérifier la sérialisation
print("\n=== TEST 2: Sérialisation ===")
serializer = AvisSerializer(avis_test)
data = serializer.data
print(f"Données sérialisées:")
print(f"  connu_facebook: {data.get('connu_facebook')}")
print(f"  connu_instagram: {data.get('connu_instagram')}")
print(f"  connu_tiktok: {data.get('connu_tiktok')}")
print(f"  connu_amis: {data.get('connu_amis')}")
print(f"  connu_autres: {data.get('connu_autres')}")

# Test 3: Simuler une requête POST
print("\n=== TEST 3: Simulation POST ===")
post_data = {
    'qualite_service': 4,
    'accueil_personnel': 5,
    'rapidite': 4,
    'rapport_qualite_prix': 3,
    'satisfaction_globale': 4,
    'suggestions': 'Test POST',
    'connu_facebook': True,
    'connu_instagram': True,
    'connu_tiktok': False,
    'connu_amis': False,
    'connu_autres': False
}

serializer_post = AvisSerializer(data=post_data)
if serializer_post.is_valid():
    avis_post = serializer_post.save()
    print(f"Avis POST créé - ID: {avis_post.id}")
    print(f"Facebook: {avis_post.connu_facebook}")
    print(f"Instagram: {avis_post.connu_instagram}")
else:
    print(f"Erreurs: {serializer_post.errors}")

print("\n=== NETTOYAGE ===")
avis_test.delete()
if 'avis_post' in locals():
    avis_post.delete()
print("Avis de test supprimés")